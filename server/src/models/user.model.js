const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  avatar_url: {
    type: String,
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  blog: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  public_repos: {
    type: Number,
    default: 0,
  },
  public_gists: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  followers_url:{
    type: String
  },
  following_url:{
    type:String
  },
  repos_url:{
    type:String
  },
  friends: [
    {
      type: [String],
      default: [],
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false, 
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('User', UserSchema);
