const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN
};


module.exports = config;
