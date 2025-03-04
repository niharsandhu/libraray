const express = require('express');
const router = express.Router();
const borrowedBooks = require('../models/borrowedBookModel');
const users = require('../models/userModel');
const resources = require('../models/resourceModel');

// GET - Get all borrowed books
router.get('/borrowed-books', (req, res) => {
    res.json(borrowedBooks);
});

// GET - Get single borrowed book
router.get('/borrowed-books/:id', (req, res) => {
    const borrowedBook = borrowedBooks.find(b => b.id === req.params.id);
    if (!borrowedBook) return res.status(404).json({ error: 'Borrowed book not found' });
    res.json(borrowedBook);
});

// POST - Create borrowed book record
router.post('/borrowed-books', (req, res) => {
    const { userId, bookId, returnDate } = req.body;
    if (!userId || !bookId || !returnDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = users.find(u => u.id === userId);
    const book = resources.find(r => r.id === bookId);
    
    if (!user || !book) {
        return res.status(404).json({ error: 'User or book not found' });
    }
    
    const isBookBorrowed = borrowedBooks.some(
        b => b.bookId === bookId && b.status === "borrowed"
    );
    
    if (isBookBorrowed) {
        return res.status(400).json({ error: 'Book is already borrowed' });
    }
    
    const borrowedBook = {
        id: Date.now().toString(),
        userId,
        bookId,
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate,
        status: "borrowed"
    };
    
    borrowedBooks.push(borrowedBook);
    res.status(201).json(borrowedBook);
});

// PUT - Update borrowed book record
router.put('/borrowed-books/:id', (req, res) => {
    const { returnDate, status } = req.body;
    const borrowedBook = borrowedBooks.find(b => b.id === req.params.id);
    if (!borrowedBook) return res.status(404).json({ error: 'Borrowed book not found' });
    
    if (returnDate) borrowedBook.returnDate = returnDate;
    if (status) borrowedBook.status = status;
    res.json(borrowedBook);
});

// DELETE - Delete borrowed book record
router.delete('/borrowed-books/:id', (req, res) => {
    const index = borrowedBooks.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Borrowed book not found' });
    
    borrowedBooks.splice(index, 1);
    res.json({ message: 'Borrowed book record deleted' });
});

module.exports = router;
