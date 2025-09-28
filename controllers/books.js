const mongodb = require('../data/database'); 
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //swagger.Tags = ['Hello World'];
    try {
        console.log('getAll called');
        const db = mongodb.getDatabase();
        console.log('Database retrieved:', typeof db);
        console.log('Collection method exists:', typeof db.collection);
        const result = await db.collection('books').find();
        result.toArray().then((books) =>{
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(books);
        });
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ error: error.message });
    }
}

const getSingle = async (req, res) => {
    //swagger.Tags = ['Hello World'];
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().collection('books').find({_id: bookId});
    result.toArray().then((books) =>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(books[0]);
    });
};

module.exports = {
    getAll,
    getSingle
};