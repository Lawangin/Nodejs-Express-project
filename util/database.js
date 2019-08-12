const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Lawangin:iam2ndkhanz@cluster0-ssqlj.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('connected!');
            _db = client.db();  // Can connect to test by placing 'test' in db()
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'no database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


// Sequelize and MySQL code
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

// const Sequelize = require('sequelize');
//
// const sequelize = new Sequelize('node-complete', 'root', 'iam2ndkhanz', {  //password removed
//     dialect: 'mysql',
//     host: 'localhost'
// });
//
//
// module.exports = sequelize;
