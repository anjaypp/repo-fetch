const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Default route for root URL
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use /api/v1/ for accessing routes.');
});

// API routes
app.use('/api/v1/', userRoutes);

// Start server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
