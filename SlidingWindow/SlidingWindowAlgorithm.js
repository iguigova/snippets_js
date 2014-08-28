var evalMaxInSlidingWindow = function(datapoints, windowsize){
    var Aprev = [];
    var Acurr = [];
    var Aresult = [];

    for (var i = 0, len = datapoints.length; i < len; i++)
    {
        if (i < windowsize)
        {
            for(var j = 0; j < windowsize; j++)
            {
                if (j < i)
                {
                    Acurr[j] = Math.max(datapoints[i], Aprev[j]);
                }
                if (j == i)
                {
                    Acurr[j] = datapoints[i];
                }
            }
        } 
        else 
        {
            for(var j = 0; j < windowsize; j++)
            {
                if (j < windowsize - 1)
                {
                    Acurr[j] = Math.max(datapoints[i], Aprev[j + 1]);
                }
                if (j == windowsize - 1)
                {
                    Acurr[j] = datapoints[i];
                }
            }
        }

        Aresult.push(Acurr[0]);
        Aprev = [].concat(Acurr);
    }
    
    return Aresult;
};

var evalSlidingWindow = function(datapoints, windowsize, params, output){
    var timer = createTimer();

    output && output.append('<div><br/>Test [' + params + ']: ' 
                  + '<br/> Datapoints: ' + datapoints
                  + '<br/> WindowSize: ' + windowsize
                  + '<br/> Maximums: ' + evalMaxInSlidingWindow(datapoints, windowsize).toString()
                  + '<br/> Time(ms): ' + timer.getTicks() + '</div>');

    return timer.getTicks();
};

var createTimer = function(startTime){
    var timer = {};
    timer.startTime = startTime || new Date();
    timer.getTicks = function(endTime){ return (endTime || new Date()).getTime() - timer.startTime.getTime();  };
    timer.reset = function(newTime){ timer.startTime = newTime || new Date()};
    return timer;
};

var run = function(input, windowsize, output){
    output.children().remove();

    input && $(input).each(function(idx){ 
        var node = $(this);
        evalSlidingWindow((node.val() || node.text()).split(' '), node.attr('windowsize') || windowsize.val(), node.attr('max'), output);        
    });
};

var randomarr = function(size){
    var result = [];
    for (var i = 0; i < size; i++){
        result.push((Math.floor(Math.random()*100) + 1));
    }  
    return result;
};

var runrandom = function(input, windowsize, output){
    output.children().remove();

    evalSlidingWindow(randomarr(input.val()), windowsize.val(), undefined, output);
};

//WSH.Echo("Hello World");
//WSH.Quit;
//WSH.echo(randomarr(1000000));
//WSH.echo(evalMaxInSlidingWindow(randomarr(1000000), 4));
//WSH.echo(evalSlidingWindow(randomarr(1000000), 4000));
