const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

//Fetch user data from GitHub API and save to database
router.post('/users/:user', userController.createUser);

router.get('/users/search', userController.searchUsers);

router.delete('/users/:user', userController.deleteUser);

router.put('/users/:user', userController.updateUser);

router.get('/users', userController.sortUsers);

module.exports = router;