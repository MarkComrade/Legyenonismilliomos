const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok" });
        }

        await database.register(userName, password);
        res.status(201).json({ success: true, message: "Sikeres regisztráció" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok" });
        }

        const user = await database.login(userName, password);

        req.session.userId = user.id;
        req.session.userName = user.userName;
        req.session.role = user.role;

        res.status(200).json({
            success: true,
            message: "Sikeres bejelentkezés",
            role: user.role
        });

    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
});

router.get('/logout', (request, response) => {
    request.session.destroy();
    response.status(200).json({
        message: 'Kijelentkezve',
        success: true
    });
});

router.get('/check-session', (request, response) => {
    if (request.session.userId) {
        response.status(200).json({
            loggedIn: true,
            userName: request.session.userName,
            role: request.session.role
        });
    } else {
        response.status(200).json({
            loggedIn: false
        });  
    }
});

router.post('/addQuestion', upload.none(), async (request, response) => { 
    try {
        const {question, difficulty, answer1, answer2, answer3, answer4, correctAnswer} = request.body;
        const questionId = await database.insertQuestion(question, difficulty);

        await database.insertAnswer(questionId, answer1, answer2, answer3, answer4, correctAnswer);

        response.status(200).json({
            message: 'Kérdés sikeresen hozzáadva.',
            result: {question, difficulty, answer1, answer2, answer3, answer4, correctAnswer}
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a kérdés hozzáadásakor.'
        });
    }
});

router.get('/getGameState', async (request, response) => {
    try {
        response.status(200).json({
            round: request.session.round || 1,
            money: request.session.money || 0
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a játék állapotának lekérésekor.',
        });
    }
});

router.post('/updateGameState', async (request, response) => {
    try {
        const { round } = request.body;
        request.session.round = round;
        response.status(200).json({
            round: request.session.round
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a játék állapotának lekérésekor.',
        });
    }
});

router.post('/useHelp', async (request, response) => {
    try {
        const { helpType } = request.body;
        if (helpType === 'fiftyFifty') request.session.fiftyFiftyUsed = true;
        if (helpType === 'phoneAFriend') request.session.phoneAFriendUsed = true;
        if (helpType === 'askTheAudience') request.session.askTheAudienceUsed = true;

        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ message: 'Hiba történt a segítség használatakor.' });
    }
});

router.get('/getHelpState', async (request, response) => {
    response.status(200).json({
        fiftyFifty: request.session.fiftyFiftyUsed || false,
        phoneAFriend: request.session.phoneAFriendUsed || false,
        askTheAudience: request.session.askTheAudienceUsed || false
    });
});

router.get('/getQuestion', async (request, response) => { 
    try { 
        if (!request.session.round) {
            request.session.round = 1;
            request.session.money = 0;
        }

        if (!request.session.currentQuestion || request.session.currentQuestion.nehezseg !== request.session.round) {
            const question = await database.getQuestions(request.session.round);
            const answers = await database.getAnswers(question.id);
            
            request.session.currentQuestion = question;
            request.session.currentAnswers = answers;
        }

        response.status(200).json({
            question: request.session.currentQuestion,
            answers: request.session.currentAnswers
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a kérdés lekérésekor.'
        });
    }
});

router.post('/getPrizeInfo', async (request, response) => {
    try {
        const { level } = request.body;
        const moneys = [0, 25000, 50000, 100000, 200000, 300000, 500000, 1000000, 2000000, 3000000, 5000000, 10000000, 25000000, 50000000, 85000000, 150000000];
        const moneyTexts = ["0 Ft", "25 000 Ft", "50 000 Ft", "100 000 Ft", "200 000 Ft", "300 000 Ft", "500 000 Ft", "1 000 000 Ft", "2 000 000 Ft", "3 000 000 Ft", "5 000 000 Ft", "10 000 000 Ft", "25 000 000 Ft", "50 000 000 Ft", "85 000 000 Ft", "150 000 000 Ft"];

        response.status(200).json({
            amount: moneys[level] || 0,
            text: moneyTexts[level] || "0 Ft"
        });
    } catch (error) {
        response.status(500).json({ message: 'Hiba történt a nyeremény lekérésekor.' });
    }
});

router.post('/checkAnswer', async (request, response) => {
    try {
        const { answer } = request.body;
        let currentAnswers = request.session.currentAnswers;
        let selectedAnswer;

        if (currentAnswers) {
            selectedAnswer = currentAnswers.find(a => a.valasz === answer.valasz);
        }

        if (!selectedAnswer) {
            selectedAnswer = answer;
        }

        const currentRound = request.session.round || 1;

        if (selectedAnswer.helyes == 1 || selectedAnswer.helyes === true) {
            request.session.round = currentRound + 1;
            response.status(200).json({ correct: true, nextRound: request.session.round });
        } else {
            let money = 0;
            let nyeremeny = "0 Ft";
            
            if (currentRound > 10) {
                money = 5000000;
                nyeremeny = "5 000 000 Ft";
            } else if (currentRound > 5) {
                money = 300000;
                nyeremeny = "300 000 Ft";
            }

            request.session.round = 1;
            request.session.money = 0;
            request.session.currentQuestion = null;
            request.session.currentAnswers = null;
            request.session.fiftyFiftyUsed = false;
            request.session.phoneAFriendUsed = false;
            request.session.askTheAudienceUsed = false;

            response.status(200).json({ correct: false, money: money, nyeremeny: nyeremeny, currentRound: currentRound });
        }
    } catch (error) {
        response.status(500).json({ message: 'Hiba történt a válasz ellenőrzésekor.' });
    }
});

router.post('/endGame', async (request, response) => {
    try {
        const { money, level } = request.body;
        if (request.session.userId) {
            await database.updateStats(request.session.userId, money, level);
        }
        request.session.round = 1;
        request.session.money = 0;
        request.session.currentQuestion = null;
        request.session.currentAnswers = null;
        request.session.fiftyFiftyUsed = false;
        request.session.phoneAFriendUsed = false;
        request.session.askTheAudienceUsed = false;
        response.status(200).json({
            message: 'Statisztika frissítve.'
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a statisztika mentésekor.'
        });
    }
});

router.get('/getUserStats', async (request, response) => {
    try {
        if (request.session.userId) {
            const stats = await database.getStats(request.session.userId);
            response.status(200).json({
                loggedIn: true,
                total_money: stats.total_money || 0,
                max_level: stats.max_level || 0
            });
        } else {
            response.status(200).json({
                loggedIn: false
            });
        }
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a statisztika lekérésekor.'
        });
    }
});

router.post('/resetGame', async (request, response) => {
    try {
        request.session.round = 1;
        request.session.money = 0;
        request.session.currentQuestion = null;
        request.session.currentAnswers = null;
        request.session.fiftyFiftyUsed = false;
        request.session.phoneAFriendUsed = false;
        request.session.askTheAudienceUsed = false;
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;