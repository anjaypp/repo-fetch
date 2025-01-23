const { generateOptions } = require('../util/util');
const https = require('https');
const axios = require('axios');
const User = require('../models/user.model');

const createUser = async (req, res) => {
  const username = req.params.user;

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username, isDeleted: false });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Fetch user data from GitHub API
    const options = generateOptions('/users/' + username);

    https.get(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', async () => {
        try {
          const userData = JSON.parse(data);

          // Handle "User not found" case
          if (userData.message === 'Not Found') {
            return res.status(404).json({ message: 'User not found' });
          }

          // Save user data to the database
          const newUser = new User({
            username: userData.login,
            name: userData.name,
            avatar_url: userData.avatar_url,
            bio: userData.bio,
            location: userData.location,
            blog: userData.blog,
            public_repos: userData.public_repos,
            public_gists: userData.public_gists,
            followers: userData.followers,
            following: userData.following,
            followers_url: userData.followers_url,
            following_url: userData.following_url,
            repos_url: userData.repos_url,
            created_at: userData.created_at,
          });

          await newUser.save();

          // Return the newly saved user data
          return res.status(200).json(newUser);
        } catch (error) {
          return res
            .status(500)
            .json({ message: 'Failed to process GitHub API response' });
        }
      });
    }).on('error', (error) => {
      return res
        .status(500)
        .json({ message: 'Failed to fetch user from GitHub', error: error.message });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchUsers = async (req, res) => {
  try{
    const { username, location } = req.query;

    const query = { isDeleted: false };

    if(username){
      query.username = { $regex: username, $options: 'i' };
    }
    if(location){
      query.location = { $regex: location, $options: 'i' };
      }
      // Fetch user from database
      const user = await User.findOne(query);
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found matching the criteria' });
      }
  
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  
module.exports = { 
  createUser,
  searchUsers
 };
