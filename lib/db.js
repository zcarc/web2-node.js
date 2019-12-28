const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'opentutorials',
    // multipleStatements: true, //여러개의 SQL 구문을 한번에 실행할 수 있도록 설정
});

db.connect();

module.exports = db;