var usertypes = require('../../bin/usertypes.js').usertypes;
var configs = require('../harness_configs.js').configs[process.env.environment];
var utils = require('../../bin/utils.js');
var emails = configs.emails;

var randomNumber = utils.randomNumber(2,25);
var password = utils.random(randomNumber - 1, 'any');

var serviceSettings = [
    {'serviceGuid' : configs.serviceGuid, 'name' : 'PasswordMinCapital', 'value' : 0},
    {'serviceGuid' : configs.serviceGuid, 'name' : 'PasswordMinSymbol', 'value' : 0},
    {'serviceGuid' : configs.serviceGuid, 'name' : 'PasswordMinLength', 'value' : randomNumber},
    {'serviceGuid' : configs.serviceGuid, 'name' : 'PasswordMaxLength', 'value' : randomNumber + 1},
    {'serviceGuid' : configs.serviceGuid, 'name' : 'PasswordMinNumeric', 'value' : 0},
    {'serviceGuid' : configs.serviceGuid, 'name' : 'RequireStrongPassword', 'value' : true},
];

exports.build = function(callback){
    return { 
        testcase: 'VPS-1024',
        description: 'PUT /user/updatepassword settings as a Guest User with insufficient minimum password length. Should return HTTP 403 and the password should not be updated.',
        usertype: usertypes.guest,
        method: 'PUT',
        route: utils.format('/user/updatepassword'), 
        pretests: [{test: (require('../../bin/settings.js').build(serviceSettings, [], callback))}],
        data: {  
            oldPassword: 'oldPassowrd',
            newPassword: password,
        },    
        status: 403,
        obj: '',
        response: {
            responseStatus:{
                errorCode: "54",
                message: String,
                errors:[]
            },
        },
        callback: callback
    };
};

