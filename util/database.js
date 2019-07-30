// const mysql = require('mysql2');
//
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'iam2ndkhanz'
// });
//
// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '', {  //password removed
    dialect: 'mysql',
    host: 'localhost'
});


module.exports = sequelize;
