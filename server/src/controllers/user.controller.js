const { generateOptions } = require("../util/util");
const https = require("https");
const axios = require("axios");
const config = require('../config/config')
const User = require("../models/user.model");

const createUser = async (req, res) => {
  const username = req.params.username; 

  try {
    // Looking for user in database before calling Github API
    const existingUser = await User.findOne({ username, isDeleted: false });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // If no data is on database, we call the Github API
    const options = generateOptions("/users/" + username);

    https
      .get(options, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", async () => {
          try {
            const userData = JSON.parse(data);

            // Notifying user if no user is found after calling Github API  
            if (userData.message === "Not Found") {
              return res.status(404).json({ message: "User not found" });
            }

            // Saving user to database
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
              created_at: userData.created_at
            });

            await newUser.save();

            // Return the newly saved user data
            return res.status(200).json(newUser);
          } catch (error) {
            return res
              .status(500)
              .json({ message: "Failed to process GitHub API response" });
          }
        });
      })
      .on("error", (error) => {
        return res
          .status(500)
          .json({
            message: "Failed to fetch user from GitHub",
            error: error.message
          });
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findAndSaveMutualFriends = async (req, res) => {
  const username = req.params.username; // Use req.params.username here

  try {
    const user = await User.findOne({ username, isDeleted: false });

    if (!user) {
      return res.status(404).json({ message: 'User not found in the database' });
    }

    if (user.friends && user.friends.length > 0) {
      return res.status(200).json({
        message: 'Mutual friends retrieved from the database',
        friends: user.friends,
      });
    }

    let { followers_url, following_url } = user;
    following_url = following_url.replace('{/other_user}', '');

    const headers = {
      Authorization: `token ${config.GITHUB_ACCESS_TOKEN}`,
    };

    const [followersResponse, followingResponse] = await Promise.all([
      axios.get(followers_url, { headers }),
      axios.get(following_url, { headers }),
    ]);

    const followers = followersResponse.data.map((follower) => ({
      username: follower.login,
      profilePicture: follower.avatar_url,
    }));

    const following = followingResponse.data.map((followedUser) => ({
      username: followedUser.login,
      profilePicture: followedUser.avatar_url,
    }));

    const mutualFriends = following.filter((followedUser) =>
      followers.some((follower) => follower.username === followedUser.username)
    );

    user.friends = mutualFriends;
    await user.save();

    res.status(200).json({
      message: 'Mutual friends fetched from GitHub API and saved to the database',
      friends: mutualFriends,
    });
  } catch (error) {
    console.error('Error finding mutual friends:', error.message);
    res.status(500).json({ error: 'Failed to find and save mutual friends' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username, location } = req.query;

    const query = { isDeleted: false };

    if (username) {
      query.username = { $regex: username, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const users = await User.find(query);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found matching the criteria" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const username = req.params.username; // Use req.params.username here

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(400).json({ message: "User is already deleted" });
    }

    await User.findOneAndUpdate({ username }, { $set: { isDeleted: true } });

    res.json({ message: "User soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const username = req.params.username; // Use req.params.username here
  const { name, location, blog, bio } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { username, isDeleted: false },
      { $set: { name, location, blog, bio } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found or is deleted" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

const sortUsers = async (req, res) => {
  try {
    const sortField = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const validFields = [
      "public_repos",
      "public_gists",
      "followers",
      "following",
      "created_at"
    ];
    if (!validFields.includes(sortField)) {
      return res.status(400).json({
        error: `Invalid sort field. Valid fields are: ${validFields.join(", ")}`
      });
    }

    const users = await User.find({ isDeleted: false }).sort({
      [sortField]: sortOrder
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  findAndSaveMutualFriends,
  searchUsers,
  deleteUser,
  updateUser,
  sortUsers
};
