var logger = require('./logger.js');
var utils = require('./utils.js');

exports.validate = function(input){
    logger.debug(utils.format('Validating input: {0}', JSON.stringify(input)));

    for(var parameter in input){
         if (!input[parameter]){
             logger.log(utils.format('{0} is not defined in the input. Aborting...', parameter));
             //throw new Error("Aborting...");
        }
    } 
};
