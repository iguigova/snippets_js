
var parse = function(input, output){
    if (input && output){

        output.children().remove();
        
        var timer = createTimer();
        var text = input.text() || input.val() + ' ';
        output.append('<div>'
                      + log('text length', text.length)
                      + logPattern('tokens', text, '\\s+')
                      + logTokens('characters', text, 'abcdefghijklmnopqrstuvwxyz', true)
                     // + logTokens('special', text, '.?[]\/_-!')
                      + logTokens('tokens', text, removeDuplicates(text.split(/\s+/g)))
                      + '</div>');

        output.append('<div>' + log('time (ms)', timer.getTicks()) + '</div>');
    }
}

var logTokens = function(label, text, tokens, ignoreUndefined){
    var t = log(label, ' ');
    for (var i = 0, len = (tokens || []).length; i < len; i++){
        var token = tokens[i];
        t += logPattern(token, text, token, ignoreUndefined);
    }
    return t;
}

var logPattern = function(label, text, pattern, ignoreUndefined){
    return log(label, (text.match(new RegExp(escape(pattern), 'gi')) || []).length, ignoreUndefined);
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
        var el = arr[i];
        if (!obj[el]){
            obj[el] = 1;
            result.push(el);
        }
    }
    return result;
};

var escape = function(pattern){
    return pattern;
}
