require('./exceptions.js').validate(
    {
        configs: process.env.configs,
        environment: process.env.environment
    }
);

var logger = require('./logger.js');
var utils = require('./utils.js');
var fw = require('./frisbywrap.js');
var usertypes = require('./usertypes.js').usertypes;

var test = function(serviceguid, username, password, callback){
    return {
        testcase: ' ',
        description: utils.format('Creating a new service user as {0} / {1}', username, password),
        usertype: usertypes.superuser,
        method: 'POST',
        route: utils.format('/services/{0}/users', serviceguid), 
        data: { 
            EmailAddress: username,
            Password: password,
            FirstName: 'service',
            LastName: 'user',
            PreRegister: true,
            SkipRegConfirmation: true,
            ServiceUserGroupType: 'Guest',
        },    
        status: 200,
        obj: '',
        response: { 
            serviceUserGuid: String
        }, 
        callback: callback
    };
}

exports.build = function(serviceguid, username, password, callback){
    var configs = process.env.configs;

    return require('./login.js').build(function(context){
        fw.run(test(serviceguid, username, password, function(output){                
            fw.resetenvironment(configs);
            (process.env.anonymous == "undefined") ? fw.run(require('./login.js').build(callback)) : callback();
        }), context);
    }, '/authenticate', usertypes.superuser, '../DirectoryAPI/harness_configs.js');
};
