const https = require("https");
const axios = require("axios");
const config = require('../config/config')
const User = require("../models/user.model");

const GITHUB_ACCESS_TOKEN = config.GITHUB_ACCESS_TOKEN;
const GITHUB_USER_AGENT = config.GITHUB_USER_AGENT;

const createUser = async (req, res) => {
  const username = req.params.username;

  try {
    // Check if user exists in DB
    const existingUser = await User.findOne({ username, isDeleted: false });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // GitHub API Request with Access Token
    const githubResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${GITHUB_ACCESS_TOKEN}`,
        "User-Agent": GITHUB_USER_AGENT, 
      },
    });

    if (!githubResponse.data || githubResponse.data.message === "Not Found") {
      return res.status(404).json({ message: "User not found" });
    }

    // Save user to DB
    const userData = githubResponse.data;
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
    return res.status(200).json(newUser);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ message: "Rate limit exceeded or invalid token" });
    }
    return res.status(500).json({ message: "Failed to fetch user from GitHub", error: error.message });
  }
};

const findAndSaveMutualFriends = async (req, res) => {
  const username = req.params.username;

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
  const username = req.params.username;

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
  const username = req.params.username;
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
