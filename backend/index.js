const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Import routes
const userRouter = require('./routes/userRoutes');
const reserveBookRouter  = require('./routes/reserveBookRoute');
const bookRoutes = require('./routes/bookRoute');
const borrowedBookRoutes = require('./routes/borrowedBookRoutes');

// Import custom error handler
const errorHandler = require('./middlewares/errorHandler');

// Middleware
app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/reservations', reserveBookRouter);
app.use('/api/books', bookRoutes);
app.use('/api/borrowed-books', borrowedBookRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
