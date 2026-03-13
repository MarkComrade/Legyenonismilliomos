const mysql = require('mysql2/promise');
const crypto = require('crypto');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'lom',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function selectall() {
    const query = 'SELECT * FROM exampletable;';
    const [rows] = await pool.execute(query);
    return rows;
}

async function register(userName, password) {
    const hashedPassword = hashPassword(password);
    const query = 'INSERT INTO users (userName, password) VALUES (?, ?)';
    const [results] = await pool.execute(query, [userName, hashedPassword]);
    return results;
}

async function login(userName, password) {
    const hashedPassword = hashPassword(password);
    const query = 'SELECT * FROM users WHERE userName = ? AND password = ?';
    const [results] = await pool.execute(query, [userName, hashedPassword]);
    
    if (results.length === 0) {
        throw new Error('Helytelen felhasználónév vagy jelszó');
    }
    
    return results[0];
}

async function insertQuestion(question, difficulty) { 
    const [lastKerdesId] = await pool.execute('SELECT MAX(id) AS maxId FROM kerdesek;');
    let questionId = (lastKerdesId[0].maxId) + 1;

    const query = 'INSERT INTO kerdesek (id, kerdes, nehezseg) VALUES (?, ?, ?);';
    await pool.execute(query, [questionId, question, difficulty]);

    return questionId;
}

async function insertAnswer(questionId, answer1, answer2, answer3, answer4, isCorrect) {
    const [lastId] = await pool.execute('SELECT MAX(id) AS maxId FROM valaszok;');
    let nextId = (lastId[0].maxId) + 1;

    const query = 'INSERT INTO valaszok (id, valasz, kid, helyes) VALUES (?, ?, ?, ?);';
    await pool.execute(query, [nextId++, answer1, questionId, isCorrect === "firstCorrect" ? 1 : 0]);
    await pool.execute(query, [nextId++, answer2, questionId, isCorrect === "secondCorrect" ? 1 : 0]);
    await pool.execute(query, [nextId++, answer3, questionId, isCorrect === "thirdCorrect" ? 1 : 0]);
    await pool.execute(query, [nextId++, answer4, questionId, isCorrect === "fourthCorrect" ? 1 : 0]);
}

async function getQuestions(round) {
    const query = 'SELECT * FROM kerdesek WHERE nehezseg = ? ORDER BY RAND() LIMIT 1;';
    const [rows] = await pool.execute(query, [round]);
    return rows[0];
}

async function getAnswers(questionId) {
    const query = 'SELECT * FROM valaszok WHERE kid = ?;';
    const [rows] = await pool.execute(query, [questionId]);
    return rows;
}

module.exports = {
    selectall,
    register,
    login,
    insertQuestion,
    insertAnswer,
    getQuestions,
    getAnswers
};