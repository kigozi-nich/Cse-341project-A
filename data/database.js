const { MongoClient } = require('mongodb');

let _database;

const initDb = (callback) => {
  if (_database) {
    console.log('Database is already initialized!');
    return callback(null, _database);
  }
  
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _database = client;
      console.log('Connected to MongoDB');
      callback(null, _database);
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!_database) {
    throw Error('Database not initialized');
  }
  return _database;
};

module.exports = {
  initDb,
  getDatabase
};