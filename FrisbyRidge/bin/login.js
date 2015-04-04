require('./exceptions.js').validate(
    {
        usertype: process.env.usertype,
        environment: process.env.environment
    }
);

var logger = require('./logger.js');
var utils = require('./utils.js');

var credentials = require(utils.format('{0}/Credentials', process.env.jasmine || '../../../Jasmine Test Credentials')).credentials;
var usertypes = require('./usertypes.js').usertypes;

exports.build = function(callback, route, usertype, configs, username, password){
    username = username || credentials[process.env.environment][usertype || process.env.usertype].username;
    password = password || credentials[process.env.environment][usertype || process.env.usertype].password;
    
    var base = { 
        testcase: '',
        description: utils.format('Authenticating as {0}/{1}', username, password),
        configs: configs,
        usertype: usertypes.all,
        method: 'POST',
        route: route || '/login', 
        data: { username: username, password: password, rememberMe: false },             
        response: { }, //NOTE: response: { sessionId: String, userName: String } the response from the DirectoryAPI differs: response: { sessionId: String, userName: String }
    };

    switch(usertype || process.env.usertype){
        case 'invalid': {
            base.status = 404;
            base.response = { responseStatus: {	errorCode: '810', message: String }};
        };
        break;
        case 'invited': {
            base.status = 403;
            base.response = { responseStatus: {	errorCode: '920', message: String }};
        };
        break;
    }

    base.callback = function(){
        callback && callback(this);
    }
    
    return base;
};

