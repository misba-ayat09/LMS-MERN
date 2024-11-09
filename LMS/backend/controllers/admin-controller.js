const Admin = require('../models/admin');
const Book = require('../models/book');
const Genre = require('../models/genre');

// Hardcoded credentials for admin login
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// Admin Login Controller (for testing purposes)
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Check if username and password match the hardcoded values
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Login successful', username });
    } else {
        return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
    }
};

// Add a New Book with Genre Reference
exports.addBook = [async (req, res) => {  // Apply admin authentication logic here if necessary
    const { book_name, author, genre, price, publication } = req.body;

    try {
        // Check if the genre exists
        const genreDoc = await Genre.findById(genre);
        if (!genreDoc) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        // Create a new book document
        const newBook = new Book({
            book_name,
            author,
            genre: genreDoc._id,  // Reference to the genre document
            price,
            publication
        });

        // Save the book to the database
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully!', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add book. Please try again later.', error });
    }
}];

// Update a Book by ID
exports.updateBook = [async (req, res) => {  // Apply admin authentication logic here if necessary
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
}];

// Delete a Book by ID
exports.deleteBook = [async (req, res) => {  // Apply admin authentication logic here if necessary
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
}];

