const constants=require('../config/constants');
const config = require('../config/config')

const generateOptions=(_path)=>{
    return options = {
        hostname: constants.hostname,
        path: _path,
        headers: {
            'User-Agent': constants.user_agent
        },
        OAUth: config.GITHUB_ACCESS_TOKEN
    }
}

module.exports ={ generateOptions }