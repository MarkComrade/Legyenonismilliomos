const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
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

router.get('/getGameState', async (request, response) => {
    try {
        request.session.round = 1;
        request.session.money = 0;
        response.status(200).json({
            round: request.session.round,
            money: request.session.money
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a játék állapotának lekérésekor.',
        });
});

router.get('/getQuestion', async (request, response) => { 
    try { 

    } catch (error) {

    }
});

router.get('/getAnswers', async (request, response) => {

});

module.exports = router;
