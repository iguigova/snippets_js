require('./exceptions.js').validate(
    {
        configs: process.env.configs,
        environment: process.env.environment
    }
);

var utils = require('./utils.js');
var env = require(process.env.configs).configs[process.env.environment];

var protocol = process.env.protocol || env.protocol || 'https';
var host = process.env.host || env.host;
var endpoint = process.env.endpoint || env.endpoint || 'api';

exports.url = utils.format('{0}://{1}/{2}', protocol, host, endpoint);

exports.config = 
{
    request: 
    {
        headers: 
        {
            'Host': host,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        rejectUnauthorized: true, // use when SSL certificate is invalid
    },
    timeout: process.env.timeout || env.timeout || (120*1000)
};

