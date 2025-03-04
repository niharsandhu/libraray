const express = require('express');
const app = express();
const port = 3000;

// Import routes
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const borrowedBookRoutes = require('./routes/borrowedBookRoutes');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', userRoutes);
app.use('/api', resourceRoutes);
app.use('/api', borrowedBookRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
