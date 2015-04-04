var usertypes = require('../../bin/usertypes.js').usertypes;
var utils = require('../../bin/utils.js'); 
var validators = require('../../bin/validators.js');
var fw = require('../../bin/frisbywrap.js');

var configs = require('../harness_configs.js').configs[process.env.environment];

exports.build = function(callback){
    return { 
         testcase: '',
         description: '',
         usertype: usertypes.all,
         method: 'GET',
         route: utils.format(''), 
         data: { },    
         status: 200,
         obj: '',
         response: { },
         callback: callback
     };
};
