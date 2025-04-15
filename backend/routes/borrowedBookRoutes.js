const express = require('express');
const router = express.Router();
const borrowedBookController = require('../controllers/borrowedBookController');

router.get('/books', borrowedBookController.getAllBorrowedBooks);
router.get('/:id', borrowedBookController.getBorrowedBookById);
router.post('/', borrowedBookController.borrowBook);
router.put('/:id/return', borrowedBookController.returnBook);
router.delete('/:id', borrowedBookController.deleteBorrowRecord);

module.exports = router;
