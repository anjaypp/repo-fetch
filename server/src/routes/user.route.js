const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

// Fetch user data from GitHub API and save to database
router.post('/users/:username', userController.createUser);

// Find and save mutual friends
router.get('/users/:username/friends', userController.findAndSaveMutualFriends);

// Search users by query params
router.get('/users/search', userController.searchUsers);

// Delete user by username
router.delete('/users/:username', userController.deleteUser);

// Update user data by username
router.put('/users/:username', userController.updateUser);

// Sort users by field
router.get('/users', userController.sortUsers);

module.exports = router;
