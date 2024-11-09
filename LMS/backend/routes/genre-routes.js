const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genre-controlle')

router.post('/',genreController.addGenre);
router.get('/',genreController.getGenres)

module.exports = router;