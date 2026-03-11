const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

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

async function register(userName, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (userName, password) VALUES (?, ?)';
    const [results] = await pool.execute(query, [userName, hashedPassword]);
    return results;
}

async function login(userName, password) {
    const query = 'SELECT * FROM users WHERE userName = ?';
    const [results] = await pool.execute(query, [userName]);
    
    if (results.length === 0) throw new Error('Felhasználó nem található');
    
    const passwordMatch = await bcrypt.compare(password, results[0].password);
    if (passwordMatch) {
        return results[0];
    } else {
        throw new Error('Helytelen jelszó');
    }
}

//!Export
module.exports = {
    selectall,
    register,
    login
};
