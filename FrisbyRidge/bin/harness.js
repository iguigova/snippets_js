var utils = require('./utils.js');
var logger = require('./logger.js');
var usertypes = require('./usertypes.js').usertypes;

var position = 0;
var tests = [];
    
var init = function(){
    logger.log("<<Harness>> Initialising...", 'console');
    
    var testfolder = process.env.specs;
    logger.debug(utils.format('Reading folder: {0}, {1}', testfolder, tests));
    
    require("fs").readdirSync(testfolder).forEach(function(file) {
        //logger.debug(utils.format('Reading file: {0}', file));
        
        if (file != 'test_template.js') {
            var testcase = process.env.testcase;
            if (!testcase || (file.indexOf(testcase) > -1)){
                var test = require(utils.format('{0}/{1}', testfolder, file)).build(run);                    
                if ( !((test.usertype != usertypes.all) && (test.usertype != process.env.usertype)) ){

                    tests = tests.concat(test.pretests || []);

                    var repeat = process.env.repeat || test.repeat || 1;                        
                    while (repeat-- > 0){
                        tests.push(
                            {
                                file:file,
                                test:test
                            }
                        );                      
                    }
                }
            }
        }
    });
    
    logger.log(utils.format('<<Harness>> Initialized. {0} test setup', tests.length), 'all');
    logger.debug(JSON.stringify(tests));
};

var run = function(context){
    if (position == 0){
        logger.log('<<Harness>> Starting...', 'console');
    }

    if (position >= tests.length){
        logger.log('<<Harness>> Batch tests completed.', 'console');
        return;
    }
    
    test = tests[position++];
    
    logger.log(utils.format('\n<<Harness>> Running: [{0}] {1}', parseInt(position), test.file || '(no file name was specified)'));
    logger.debug(JSON.stringify(test));

    test.callback = function(){
        testcallback = test.callback;

        return function(){
            (testcallback) ? testcallback.apply(this, arguments) : run(context);
        }
    }

    require('./frisbywrap').run(test.test, context);
};  

exports.run = function(context){
    init();
    run(context);
};
