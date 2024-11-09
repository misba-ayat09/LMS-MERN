const Rent = require('../models/rental');
const Book = require('../models/book');
const Member = require('../models/member');
const mongoose = require('mongoose');

// Rent a Book
exports.rentBook = async (req, res) => {
    const { book, member } = req.body;

    try {
        // Check if the book and member exist
        const bookDoc = await Book.findById(book);
        const memberDoc = await Member.findById(member);

        if (!bookDoc || !memberDoc) {
            return res.status(404).json({ message: 'Book or Member not found' });
        }

        // Calculate rental rate as 5% of book's price
        const rentalRate = bookDoc.price * 0.05;

        // Set the rental date to today and due date to 10 days later
        const rentalDate = new Date();
        const dueDate = new Date(rentalDate);
        dueDate.setDate(rentalDate.getDate() + 10);

        // Create a new rental document
        const newRental = new Rent({
            book: bookDoc._id,
            member: memberDoc._id,
            rental_date: rentalDate,
            due_date: dueDate,
            fine: 0  // Initial fine is zero, will be calculated if overdue
        });

        // Save the rental to the database
        await newRental.save();
        res.status(201).json({
            message: 'Book rented successfully!',
            rental: newRental,
            rentalRate: rentalRate.toFixed(2)  // Return rental rate in response
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to rent book. Please try again later.', error });
    }
};

// Return Book and Calculate Fine if Overdue


exports.returnBook = async (req, res) => {
    console.log('Request Parameters:', req.params);  // Log all parameters

    const { rentalId } = req.params;
    console.log('Rental ID:', rentalId);  // Log the rentalId

    if (!mongoose.Types.ObjectId.isValid(rentalId)) {
        return res.status(400).json({ message: 'Invalid rental ID format' });
    }

    try {
        const rental = await Rent.findById(rentalId).populate('book');
        if (!rental) {
            return res.status(404).json({ message: 'Rental record not found' });
        }

        const returnDate = new Date();
        rental.return_date = returnDate;

        if (returnDate > rental.due_date) {
            const overdueDays = Math.ceil((returnDate - rental.due_date) / (1000 * 60 * 60 * 24));
            rental.fine = overdueDays;
        } else {
            rental.fine = 0;
        }

        await rental.save();

        res.status(200).json({
            message: 'Book returned successfully!',
            rental: rental,
            fine: rental.fine
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to return book. Please try again later.', error });
    }
};


