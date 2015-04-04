var frisby = require('frisby');
var utils = require('./utils.js');
var logger = require('./logger.js');

exports.init = function(configs, specs, anonymous, route){
    process.env.configs = process.env.configs || configs;
    process.env.specs = process.env.specs || specs;

    process.env.anonymous = process.env.anonymous || anonymous;
    logger.debug(utils.format('Tests run {0} [{1}]', (process.env.anonymous == "undefined") ? 'authenticated' : 'anonymous/public', process.env.anonymous));

    (process.env.anonymous == "undefined") ? this.run(require('./login.js').build(require('./harness.js').run, route)) : require('./harness.js').run();
};

var resetenvironment = function(configs){
    if (configs){
        delete require.cache[require.resolve('./environment.js')];
        process.env.configs = configs;
        logger.debug('Resettting environment to: ' + require('./environment.js').url);
    }

    return require('./environment.js');
};

exports.resetenvironment = resetenvironment;

var setup = function(test, context){
    var env = resetenvironment(test.configs);

    logger.debug(utils.format('current environment: {0}', JSON.stringify(env.config)));

    if (context && context.current && context.current.response){
        logger.debug(utils.format('context/response: {0}', JSON.stringify(context.current.response)));

        var cookie = '';
        var setCookie = context.current.response.headers['set-cookie'];

        for(var i = 0, l = (setCookie || '').length; i < l; i++) {
            cookie += setCookie[i].split(";")[0] + ";";
        }

        cookie && (env.config.request.headers['Cookie'] = cookie);
    }

    logger.debug(utils.format('updated environment: {0}', JSON.stringify(env.config)));

    frisby.globalSetup(env.config);

    return env;
};

exports.setup = function (test, context) {
    var env = resetenvironment(test.configs);

    logger.debug(utils.format('current environment: {0}', JSON.stringify(env.config)));

    if (context && context.current && context.current.response){
        logger.debug(utils.format('context/response: {0}', JSON.stringify(context.current.response)));

        var cookie = '';
        var setCookie = context.current.response.headers['set-cookie'];

        for(var i = 0, l = (setCookie || '').length; i < l; i++) {
            cookie += setCookie[i].split(";")[0] + ";";
        }

        cookie && (env.config.request.headers['Cookie'] = cookie);
    }

    logger.debug(utils.format('updated environment: {0}', JSON.stringify(env.config)));

    frisby.globalSetup(env.config);

    return env;
};

var split = function(test){
    var result = [];

    var repeat = test.repeat || 1;
    while (repeat-- > 0){
        var t = JSON.parse(JSON.stringify(test));
        t.repeat = 1;
        result.push(t);
    }

    return result;
};

var page = function(test, context){
    var result = [];

    var totalPages = context.currentRequestFinished.body.totalPages;
    var pages = utils.pagesToArr((process.env.pages || test.pages || '').replace('total', totalPages));

    logger.debug('Pages requested: ' + JSON.stringify(pages));

    for(var i = 0, l = pages.length; i < l; i++){
        var t = JSON.parse(JSON.stringify(test));
        t.pages = '';
        t.data.page = pages[i];
        t.response.totalPages = totalPages;
        result.push(t);
    }

    return result;
};

exports.run = function(test, context){
    var env = setup(test, context);
    var url = test.url || env.url;

    var fw = this;

    if (fw.loop(split(test), context, test.callback, 1, 'Repeat test: {0}: {1}')) return;

    var f = frisby.create(utils.format('{0} - {1}', test.testcase, test.description));

    switch(test.method){
        case 'GET': f = f.get(utils.format('{0}{1}', url, test.route), {body: test.data, json: true}); break;
        case 'POST': f = f.post(utils.format('{0}{1}', url, test.route), test.data, {json: true}); break;
        case 'PUT': f = f.put(utils.format('{0}{1}', url, test.route), test.data, {json: true}); break
        case 'DELETE': f = f.delete(utils.format('{0}{1}', url, test.route), test.data, {json: true}); break;
        case 'FILE': f = f.post(utils.format('{0}{1}', url, test.route), test.data, {json: false, headers: {
            'content-type': 'multipart/form-data; boundary=' + test.data.getBoundary(),
            'content-length': test.data.getLengthSync(),
            'cookie': frisby.globalSetup().request.headers['Cookie'],
        }}); break;
    }

    f.expectStatus(test.status || 200)
        .expectJSONTypes(test.obj || '', test.response)
        .expectJSON(test.obj || '', test.response)
        .after(function(){
            logger.log(JSON.stringify(f.current, null, 4));

            if (!fw.loop(page(test, f), f, test.callback, 0, 'Pages test: {0}: {1}')){
                test.callback && test.callback.call(f, f);
            }
        })

        .toss(); //run
};

exports.loop = function(tests, context, callback, deductible, message){
    logger.debug(utils.format(message || 'Looping: {0}: {1}', tests.length, JSON.stringify(tests)));

    if (tests.length > (deductible || 0)){
        var fw = this;

        for(var i = tests.length - 2, l = 0; i >= l; i--){
            tests[i].callback = function(index){ return function(output){ logger.debug('Looped test run'); fw.run(tests[index], output); }}(i + 1); //http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example 
        }

        tests[tests.length - 1].callback = function(output){ callback(output) };

        fw.run(tests[0], context);

        return true;
    }

    return false;
}
