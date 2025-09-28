const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');

const authorsController = require('../controllers/authors');
router.get('/', authorsController.getAll);
router.get('/:id', authorsController.getSingle);
router.post('/', isAuthenticated, authorsController.createAuthor);
router.put('/:id', isAuthenticated, authorsController.updateAuthor);
router.delete('/:id', isAuthenticated, authorsController.deleteAuthor);

module.exports = router;