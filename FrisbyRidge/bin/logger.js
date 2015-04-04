var fs = require('fs');
var moment = require('moment');
var utils = require('./utils.js');

var root = process.env.jasmine || '.'; //logs are located in harness_spec location or in param passed 'jasmine' location
var target = 'logs';
var path = utils.format('{0}/{1}/', root, target); 

var filename = process.env.log || utils.format('{0}{1}.txt', path, moment().format("YYYYMMDD-HHmmss"));

var filemode = '0777';
var fileencoding = 'utf8';
var config = { encoding: fileencoding, mode: filemode, flag: 'a' };

var onError = function(err){
    if (err){
        console.log(err);
    }
};

var initialized = false;

var init = function(){
    //if log file hasn't been made, make it
    if (!initialized && !fs.existsSync(path)){
        fs.mkdir(path, filemode, onError);
    }

    initialized = true;
};

var log = function(data){
    init();

    if (data.indexOf('outgoing') > 0){
        var d = JSON.parse(data);
        if (d.outgoing && (d.outgoing.method == 'POST')){
            if (d.response && (d.response.status == 200)){
                for (var param in d.response.body){
                    if (param.indexOf('Guid') > 0){
                        fs.appendFile(utils.format('{0}.{1}', filename, param), d.response.body[param] + '\r\n', config, onError);
                    }
                }
            }
        }
    }

    fs.appendFile(filename, data + '\r\n', config, onError);
}

exports.log = function(data, logger){
    logger = logger || process.env.logger || 'file';

    switch (logger){
        case 'file': log(data); break;
        case 'console': console.log(data + '\r\n'); break
        case 'all': log(data); console.log(data + '\r\n'); break;
    }
};

exports.debug = function(data, logger){
    process.env.verbose && this.log(data, logger);
};
