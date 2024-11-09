const express = require('express');
const router = express.Router();

const bookController = require('../controllers/book-controller')


router.get('/search',bookController.searchBooksByGenre);

// router.post('/', bookController.addBook);
router.get('/',bookController.getAllBooks);
// router.get('/:id', bookController.getBookById);
router.patch('/',bookController.updateBook);
router.delete('/', bookController.deleteBook);

module.exports = router;