const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
let _database;

const initDb = (callback) => {
  if (_database) {
    console.log('Db is already initialized!');
    return callback(null, _database);
  }

  console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      console.log('Connected to MongoDB successfully!');
      _database = client.db();
      console.log('Database object created:', typeof _database);
      callback(null, _database);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!_database) {
    throw Error('Database not initialized');
  }
  console.log('Returning database:', typeof _database, 'collection method exists:', typeof _database.collection);
  return _database;
};

module.exports = {
  initDb,
  getDatabase
};
