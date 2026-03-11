const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'lom',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
async function selectall() {
    const query = 'SELECT * FROM exampletable;';
    const [rows] = await pool.execute(query);
    return rows;
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


//!Export
module.exports = {
    selectall,
    insertQuestion,
    insertAnswer
};
