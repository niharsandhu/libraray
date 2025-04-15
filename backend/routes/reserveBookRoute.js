const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reserveBookController');

router.post('/', reservationController.createReservation);
router.get('/user/:userId', reservationController.getUserReservations);

// Export both router and the fulfill function
module.exports = router;
