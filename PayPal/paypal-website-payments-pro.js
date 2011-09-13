
var { Client } = require('ringo/httpclient');
var { Request } = require('ringo/webapp/request');

var pc = require(ph.appRelativePath('config', 'payment-config.js'));
var pp = require(ph.appRelativePath('ph-fx/packages/payment/config', 'paypal-config.js'));

var compile = function(env){
    var config = {};
 
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, len = args.length; i < len; i++){
        ph.apply(config, args[i]);
    }

    // This is inserted by apache's mod_proxy module, and will
    // not port if we change our jack/proxy setup
    config.IPADDRESS = env.headers['x-forwarded-for'];
    
    return config;
};

var validate = function(config, onError){
    var errors = [];

    var patterns = pp.Patterns(config); 
    for (var i in patterns){
        var pattern = patterns[i];
        if (pattern.isEnabled && pattern.regex && !(pattern.regex.test(pattern.value))){
            errors.push(pattern.desc + ': ' + pattern.value + ' ');
        }
    }

    return (onError && errors.length > 0) ? onError(errors, 200) : true;
};

var make = function(config, onSuccess, onError){
    var result = validate(config, onError);

    if (result === true) {
        var client = new Client(); // print('execute: ' + ph.toNVP(config));

        client.request({
            method: 'POST',
            async: false,
            url: pc.CommonConfig.URL,
            data: ph.toNVP(config),
            success: function (content, status) { // print('content: ' + content + ' status: ' + status);
                result = onSuccess && onSuccess(content, status); 
            },
            error: function (message, status) { // print('message: ' + message + ' status: ' + status);
                result = onError && onError(message, status); 
            }
        });
    }

    return result;
};

var PaymentAPI = function() {

    // client-specific (reusable) configuration
    var args = Array.prototype.slice.call(arguments || []); 

    return function(env, info){
        var init = function(info){
            // order-specific configuration
            return compile.apply(null, [env].concat(args.concat(info)));
        }

        var execute = function(onSuccess, onError){
            return make(config, onSuccess, onError);
        };

        var config = init(info);

        return {
            init: init,
            execute: execute
        };
    };
};


exports.DirectPaymentAPI = PaymentAPI(pc.CommonConfig, pc.DirectPaymentConfig);
exports.ECSetAPI = PaymentAPI(pc.CommonConfig, pc.ECSetConfig);
exports.ECDoAPI = PaymentAPI(pc.CommonConfig, pc.ECDoConfig);

exports.ECReturnUrl = pc.ECSetConfig.RETURNURL;
exports.ECCancelUrl = pc.ECSetConfig.CANCELURL;
exports.ECCmdUrl = pc.ECSetConfig.CMDURL;

exports.Patterns = pp.Patterns();

exports.CardTypes = pp.CardTypes;
exports.CountryCodes = pp.CountryCodes;
exports.StateCodes = pp.StateCodes;
