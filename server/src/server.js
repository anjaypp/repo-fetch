const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const app = express()

//Middleware
app.use(express.json());
app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/v1/', userRoutes);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});