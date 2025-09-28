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

const createBook = async (req, res) => {
    //swagger.Tags = ['Hello World'];
    try {
        const book = {
            book_id: req.body.book_id,
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year_published: req.body.year_published,
            isbn: req.body.isbn,
            available_copies: req.body.available_copies
        };
        const response = await mongodb.getDatabase().collection('books').insertOne(book);
        
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the book.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateBook = async (req, res) => {
    //swagger.Tags = ['Hello World'];
    try {
        console.log('PUT request received');
        console.log('Book ID:', req.params.id);
        console.log('Request body:', req.body);
        
        const bookId = new ObjectId(req.params.id);
        const book = {
            book_id: req.body.book_id,
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year_published: req.body.year_published,
            isbn: req.body.isbn,
            available_copies: req.body.available_copies
        };
        
        const response = await mongodb.getDatabase().collection('books').replaceOne({_id: bookId}, book);
        console.log('Update response:', response);
        
        if (response.matchedCount === 0) {
            res.status(404).json('Book not found with the provided ID.');
        } else if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(200).json('No changes were made to the book (data was identical).');
        }
    } catch (error) {
        console.error('Error in updateBook:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteBook = async (req, res) => {
    //swagger.Tags = ['Hello World'];
    try {
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().collection('books').deleteOne({_id: bookId});
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || 'Some error occurred while deleting the book.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook
};