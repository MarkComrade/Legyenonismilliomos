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
        console.log(error);
        response.status(500).json({
            message: 'Hiba történt a kérdés hozzáadásakor.'
        });
    }
});

router.post('/updateGameState', async (request, response) => {
    try {
        const { round, money } = request.body;
        request.session.round = round;
        request.session.money = money;
        response.status(200).json({
            round: request.session.round,
            money: request.session.money
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a játék állapotának lekérésekor.',
        });
    }
});

router.get('/getHelpCountSession', async (request, response) => { 
    try { 
        response.status(200).json({
            fiftyFiftyUsed: request.session.fiftyFiftyUsed || false,
            phoneAFriendUsed: request.session.phoneAFriendUsed || false,
            askTheAudienceUsed: request.session.askTheAudienceUsed || false
        });
    }
    catch (error) {
        response.status(500).json({
            message: 'Hiba történt a segítségek lekérésekor.'
        });
    }
});

router.post('/useHelp', async (request, response) => {
    try {
        const { helpType } = request.body;
        if (helpType === 'fiftyFifty') {
            request.session.fiftyFiftyUsed = true;
        } else if (helpType === 'phoneAFriend') {
            request.session.phoneAFriendUsed = true;
        } else if (helpType === 'askTheAudience') {
            request.session.askTheAudienceUsed = true;
        }
        response.status(200).json({
            message: `${helpType} használva.`
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a segítség használatakor.'
        });
    }
});

router.get('/getQuestion', async (request, response) => { 
    try { 
        if (!request.session.round) {
            request.session.round = 1;
            request.session.money = 0;
        }

        const question = await database.getQuestions(request.session.round);
        const answers = await database.getAnswers(question.id);
        
        response.status(200).json({
            question,
            answers
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a kérdés lekérésekor.'
        });
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

module.exports = router;