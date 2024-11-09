const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin-controller')

router.post('/login',adminController.login);
router.post('/', adminController.addBook);
// router.get('/',adminController.getAllBooks);
// router.get('/:id', adminController.getBookById);
router.patch('/',adminController.updateBook);
router.delete('/', adminController.deleteBook);

module.exports = router;