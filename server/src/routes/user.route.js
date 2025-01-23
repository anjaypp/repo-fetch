const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/users/:user', userController.createUser);

module.exports = router;