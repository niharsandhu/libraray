const { reservations, saveToFile } = require('../models/reservationModel');
const { borrowedBooks } = require('../models/borrowedBookModel');
const { users } = require('../models/userModel');
const { books } = require('../models/bookModel');

// Create a reservation
exports.createReservation = (req, res, next) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: 'Need both userId and bookId' });
    }

    if (!users.some(u => u.id === userId)) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!books.some(b => b.id === bookId)) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const isBookAvailable = !borrowedBooks.some(b =>
      b.bookId === bookId && b.status === "borrowed"
    );

    if (isBookAvailable) {
      return res.status(400).json({ error: 'Book is available - just borrow it!' });
    }

    const alreadyReserved = reservations.some(r =>
      r.userId === userId &&
      r.bookId === bookId &&
      r.status === "pending"
    );

    if (alreadyReserved) {
      return res.status(400).json({ error: 'You already reserved this book' });
    }

    const newReservation = {
      id: Date.now().toString(),
      userId,
      bookId,
      date: new Date().toISOString(),
      status: "pending",
      position: reservations.filter(r => r.bookId === bookId).length + 1
    };

    reservations.push(newReservation);
    saveToFile();

    res.status(201).json({
      message: 'Reservation added!',
      reservation: newReservation
    });
  } catch (error) {
    next(error);
  }
};

// Get reservations by user ID
exports.getUserReservations = (req, res, next) => {
  try {
    const userReservations = reservations.filter(r =>
      r.userId === req.params.userId
    );
    res.json(userReservations);
  } catch (error) {
    next(error);
  }
};

// Fulfill the next reservation (used internally)
exports.fulfillNextReservation = (bookId) => {
  const pending = reservations
    .filter(r => r.bookId === bookId && r.status === "pending")
    .sort((a, b) => a.position - b.position);

  if (pending.length > 0) {
    pending[0].status = "fulfilled";
    saveToFile();
    return pending[0];
  }
  return null;
};
