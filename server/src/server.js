const express = require('express');
const config = require('./config/config');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const app = express()

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/v1/', userRoutes);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});