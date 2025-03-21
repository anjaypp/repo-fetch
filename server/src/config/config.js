const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    GITHUB_USER_AGENT: process.env.GITHUB_USER_AGENT
};


module.exports = config;
