
var parse = function(input, output){
    if (input && output){

        output.children().remove();
        
        var timer = createTimer();
        var text = input.text() || input.val() + ' ';

        output.append('<div>'
                      + log('text length', text.length)
                      + logTokens('characters', text, 'abcdefghijklmnopqrstuvwxyz', true)
                      + logTokens('special characters', text, '@#$%^&*-_=+{};:\'"|<>,.?()[]\/!', true)
                      + logTokens('tokens', text, removeDuplicates(text.split(/\s+/g)).sort())
                      + '</div>');

        output.append('<div>' + log('time (ms)', timer.getTicks()) + '</div>');
    }
}

var logTokens = function(label, text, tokens, ignoreUndefined){
    var scoredTokens = scoreTokens(text, tokens);
    var loggedTokens = log(label, ' ');
    for (var i = 0, len = scoredTokens.length; i < len; i++){
        loggedTokens += log(scoredTokens[i].token, scoredTokens[i].score, ignoreUndefined);
    }
    return loggedTokens;
}

var log = function(label, value, ignoreUndefined){
    if (!ignoreUndefined || value){
        return '<br/>' + label + ': ' + value;
    }
    return '';
}

//-----------------------

var createTimer = function(startTime){
    var timer = {};
    timer.startTime = startTime || new Date();
    timer.getTicks = function(endTime){ return (endTime || new Date()).getTime() - timer.startTime.getTime();  };
    timer.reset = function(newTime){ timer.startTime = newTime || new Date()};
    return timer;
};

var removeDuplicates = function(arr){
    var result = [];

    for (var i = 0, len = arr.length, obj = {}; i < len; i++){
        var el = escape(arr[i], '');
        if (!obj[el]){
            obj[el] = 1;
            result.push(el);
        }
    }
    return result;
};

var escape = function(pattern, value){
    return pattern.replace(/[?!@#\$%\^\&*\)\(\[\]\{\}\<\>;:'"|\\\/+=.,_-]/gi, value);
}

var scoreTokens = function(text, tokens){
    var result = [];

    for (var i = 0, len = (tokens || []).length; i < len; i++){
        result.push({'token': tokens[i], 'score': scoreToken(text, escape(tokens[i], function(match){ return '\\' + match }))});
    }

    return result;
}

var scoreToken = function(text, token){
    return (text.match(new RegExp(token, 'gi')) || []).length;
}
