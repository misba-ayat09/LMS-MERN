const Book = require('../models/book');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Genre = require('../models/Genre');


// Get All Books
exports.getAllBooks = async (req, res) => {
    try {
        // Populate genre information in each book
        const books = await Book.find().populate('genre');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve books. Please try again later.', error });
    }
};
// Search Books by Genre

exports.searchBooksByGenre = async (req, res) => {
    const { genre } = req.query;

    try {
        // Find the genre by name (not by ObjectId)
        const genreObj = await Genre.findOne({ genre });
        if (!genreObj) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        // Use the genre's ObjectId to find books
        const books = await Book.find({ genre: genreObj._id }).populate('genre');
        
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found for this genre' });
        }

        res.status(200).json(books);
    } catch (error) {
        console.error('Error searching books by genre:', error); // Log error for debugging
        res.status(500).json({ message: 'Failed to retrieve books. Please try again later.', error });
    }
};



// Get a Single Book by ID
exports.getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the book by ID and populate the genre
        const book = await Book.findById(id).populate('genre');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve book. Please try again later.', error });
    }
};

// Update a Book by ID
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { book_name, author, genre, price, publication } = req.body;

    try {
        // Find the book by ID and update with the new details
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { book_name, author, genre, price, publication },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update book. Please try again later.', error });
    }
};

// Delete a Book by ID
exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the book by ID and delete it
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete book. Please try again later.', error });
    }
};
