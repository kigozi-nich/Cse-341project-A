const express = require ('express');
const router = express.Router();

const booksController = require('../controllers/books');
router.get('/', booksController.getAll);
router.get('/:id', booksController.getSingle);

module.exports = router;