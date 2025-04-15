const { borrowedBooks } = require('../models/borrowedBookModel');
const reservations = require('../models/reservationModel');
const { books, saveToFile, getNextId } = require('../models/bookModel');

// Get all books with availability status
exports.getAllBooks = (req, res, next) => {
  try {
    const booksWithStatus = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      status: borrowedBooks.some(b => b.bookId === book.id && b.status === "borrowed")
        ? 'borrowed'
        : 'available',
      reservations: reservations.filter(r => r.bookId === book.id && r.status === "pending").length
    }));
    res.json(booksWithStatus);
  } catch (error) {
    next(error);
  }
};

// Get single book details
exports.getBookById = (req, res, next) => {
  try {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const borrowedRecord = borrowedBooks.find(b => b.bookId === book.id && b.status === "borrowed");

    res.json({
      id: book.id,
      title: book.title,
      author: book.author,
      currentStatus: borrowedRecord
        ? {
            status: 'borrowed',
            borrowedBy: borrowedRecord.userId,
            returnDate: borrowedRecord.returnDate
          }
        : { status: 'available' },
      pendingReservations: reservations
        .filter(r => r.bookId === book.id && r.status === "pending")
        .map(r => ({
          reservedBy: r.userId,
          reservationDate: r.reservationDate,
          priority: r.priority
        }))
    });
  } catch (error) {
    next(error);
  }
};

// Create a new book
exports.createBook = (req, res, next) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const newBook = {
      id: getNextId().toString(),
      title,
      author
    };

    books.push(newBook);
    saveToFile();
    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};

// Delete a book
exports.deleteBook = (req, res, next) => {
  try {
    const bookIndex = books.findIndex(b => b.id === req.params.id);
    if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });

    if (borrowedBooks.some(b => b.bookId === req.params.id && b.status === "borrowed")) {
      return res.status(400).json({ error: 'Cannot delete - book is currently borrowed' });
    }

    if (reservations.some(r => r.bookId === req.params.id && r.status === "pending")) {
      return res.status(400).json({ error: 'Cannot delete - book has pending reservations' });
    }

    const [deletedBook] = books.splice(bookIndex, 1);
    saveToFile();

    res.json({
      message: 'Book deleted successfully',
      deletedId: deletedBook.id
    });
  } catch (error) {
    next(error);
  }
};
