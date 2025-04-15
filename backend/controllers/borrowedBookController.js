const { borrowedBooks, saveToFile } = require('../models/borrowedBookModel');
const { books } = require('../models/bookModel');
const { users } = require('../models/userModel');
const { fulfillNextReservation } = require('../routes/reserveBookRoute'); // consider moving this to a service if it grows

// GET all borrowed books
exports.getAllBorrowedBooks = (req, res, next) => {
  try {
    const result = borrowedBooks.map(record => ({
      ...record,
      bookTitle: books.find(b => b.id === record.bookId)?.title || 'Unknown',
      userName: users.find(u => u.id === record.userId)?.name || 'Unknown'
    }));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// GET a single borrowed book
exports.getBorrowedBookById = (req, res, next) => {
  try {
    const record = borrowedBooks.find(b => b.id === req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    res.json({
      ...record,
      bookDetails: books.find(b => b.id === record.bookId) || {},
      userDetails: users.find(u => u.id === record.userId) || {}
    });
  } catch (error) {
    next(error);
  }
};

// POST borrow a book
exports.borrowBook = (req, res, next) => {
  try {
    const { userId, bookId, returnDate } = req.body;

    if (!userId || !bookId || !returnDate) {
      return res.status(400).json({ 
        error: 'Missing fields',
        required: { userId, bookId, returnDate }
      });
    }

    if (!users.some(u => u.id === userId)) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!books.some(b => b.id === bookId)) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (borrowedBooks.some(b => b.bookId === bookId && b.status === "borrowed")) {
      return res.status(409).json({ error: 'Book already borrowed' });
    }

    const newRecord = {
      id: Date.now().toString(),
      userId,
      bookId,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate,
      status: "borrowed"
    };

    borrowedBooks.push(newRecord);
    saveToFile();

    res.status(201).json({
      success: true,
      record: newRecord
    });
  } catch (error) {
    next(error);
  }
};

// PUT return a book
exports.returnBook = (req, res, next) => {
  try {
    const record = borrowedBooks.find(b => b.id === req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    record.status = "returned";
    saveToFile();

    const nextReservation = fulfillNextReservation(record.bookId);

    res.json({
      success: true,
      returnedRecord: record,
      nextReservationFulfilled: nextReservation ? nextReservation.id : null
    });
  } catch (error) {
    next(error);
  }
};

// DELETE a borrowing record
exports.deleteBorrowRecord = (req, res, next) => {
  try {
    const index = borrowedBooks.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });

    const [deleted] = borrowedBooks.splice(index, 1);
    saveToFile();

    res.json({
      success: true,
      deletedId: deleted.id
    });
  } catch (error) {
    next(error);
  }
};
