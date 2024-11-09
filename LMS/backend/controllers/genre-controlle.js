
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Genre = require('../models/genre');

// Add a New Genre
exports.addGenre = async (req, res) => {
    const { genre } = req.body;

    try {
        // Check if the genre already exists
        const existingGenre = await Genre.findOne({ genre });
        if (existingGenre) {
            return res.status(400).json({ message: 'Genre already exists' });
        }

        // Create a new genre document
        const newGenre = new Genre({
            genre
        });

        // Save the genre to the database
        await newGenre.save();
        res.status(201).json({ message: 'Genre added successfully!', genre: newGenre });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add genre. Please try again later.', error });
    }
};
exports.getGenres = async (req, res) => {
    try {
        const genres = await Genre.find({});
        res.status(200).json({ genres });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch genres. Please try again later.', error });
    }
};
