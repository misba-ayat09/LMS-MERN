const express = require('express');
const router = express.Router();

const rentalController = require('../controllers/rent-controller');

router.post('/',rentalController.rentBook);
router.put('/return/:rentalId',rentalController.returnBook);

module.exports = router;