const mongodb = require('../data/database'); 
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().collection('authors').find();
        result.toArray().then((authors) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(authors);
        });
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ error: error.message });
    }
}

const getSingle = async (req, res) => {
    try {
        const authorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('authors').find({_id: authorId});
        result.toArray().then((authors) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(authors[0]);
        });
    } catch (error) {
        console.error('Error in getSingle:', error);
        res.status(500).json({ error: error.message });
    }
};

const createAuthor = async (req, res) => {
    try {
        // Data validation
        if (!req.body.first_name || !req.body.last_name || !req.body.email) {
            return res.status(400).json({ error: 'first_name, last_name, and email are required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' });
        }

        const author = {
            author_id: req.body.author_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            birth_date: req.body.birth_date,
            nationality: req.body.nationality,
            biography: req.body.biography,
            books_written: req.body.books_written || []
        };
        
        const response = await mongodb.getDatabase().collection('authors').insertOne(author);
        
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json('Some error occurred while creating the author.');
        }
    } catch (error) {
        console.error('Error in createAuthor:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateAuthor = async (req, res) => {
    try {
        // Data validation
        if (!req.body.first_name || !req.body.last_name || !req.body.email) {
            return res.status(400).json({ error: 'first_name, last_name, and email are required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' });
        }

        const authorId = new ObjectId(req.params.id);
        const author = {
            author_id: req.body.author_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            birth_date: req.body.birth_date,
            nationality: req.body.nationality,
            biography: req.body.biography,
            books_written: req.body.books_written || []
        };
        
        const response = await mongodb.getDatabase().collection('authors').replaceOne({_id: authorId}, author);
        
        if (response.matchedCount === 0) {
            res.status(404).json('Author not found with the provided ID.');
        } else if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(200).json('No changes were made to the author (data was identical).');
        }
    } catch (error) {
        console.error('Error in updateAuthor:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const authorId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().collection('authors').deleteOne({_id: authorId});
        
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json('Author not found with the provided ID.');
        }
    } catch (error) {
        console.error('Error in deleteAuthor:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createAuthor,
    updateAuthor,
    deleteAuthor
};