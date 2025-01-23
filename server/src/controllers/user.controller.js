const { generateOptions } = require("../util/util");
const https = require("https");
const axios = require("axios");
const config = require('../config/config')
const User = require("../models/user.model");

const createUser = async (req, res) => {
  const username = req.params.user;

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username, isDeleted: false });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Fetch user data from GitHub API
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

            // Handle "User not found" case
            if (userData.message === "Not Found") {
              return res.status(404).json({ message: "User not found" });
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
  const username = req.params.user;

  try {
    // Step 1: Retrieve the user from the database.
    const user = await User.findOne({ username, isDeleted: false });

    // If the user doesn't exist, return 404.
    if (!user) {
      return res.status(404).json({ message: 'User not found in the database' });
    }

    // Step 2: Retrieve `followers_url` and `following_url` from the database.
    let { followers_url, following_url } = user;

    // Adjust GitHub's `following_url` to remove the placeholder `/other_user`.
    following_url = following_url.replace('{/other_user}', '');

    // Step 3: Fetch followers and following data using the stored URLs.
    const headers = {
      Authorization: config.GITHUB_ACCESS_TOKEN,
    };

    const [followersResponse, followingResponse] = await Promise.all([
      axios.get(followers_url, { headers }),
      axios.get(following_url, { headers }),
    ]);

    // Step 4: Extract followers and following usernames from the responses.
    const followers = followersResponse.data.map((follower) => follower.login);
    const following = followingResponse.data.map((followedUser) => followedUser.login);

    // Step 5: Find mutual followers (users who are both following and followers).
    const mutualFriends = following.filter((user) => followers.includes(user));

    // Step 6: Save the mutual friends back to the database.
    user.friends = mutualFriends;
    await user.save();

    // Step 7: Return the list of mutual friends.
    res.status(200).json({
      message: 'Mutual friends saved successfully',
      mutualFriends,
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
    // Fetch user from database
    const user = await User.findOne(query);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found matching the criteria" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const username = req.params.user;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already soft-deleted
    if (user.isDeleted) {
      return res.status(400).json({ message: "User is already deleted" });
    }

    // Soft delete the user by setting isDeleted to true
    await User.findOneAndUpdate({ username }, { $set: { isDeleted: true } });

    res.json({ message: "User soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const username = req.params.user;
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

    return res.status(404).json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

const sortUsers = async (req, res) => {
  try {
    // Retrieve sorting field from query
    const sortField = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    // Checking whether fields are valid
    const validFields = [
      "public_repos",
      "public_gists",
      "followers",
      "following",
      "created_at"
    ];
    if (!validFields.includes(sortField)) {
      return res
        .status(400)
        .json({
          error: `Invalid sort field. Valid fields are: ${validFields.join(
            ", "
          )}`
        });
    }

    //Fetch users from database and sort
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
