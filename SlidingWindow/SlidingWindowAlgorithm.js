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
        } else {
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

    output.append('<div><br/>Test [' + params + ']: ' 
                  + '<br/> Datapoints: ' + datapoints
                  + '<br/> WindowSize: ' + windowsize
                  + '<br/> Maximums: ' + evalMaxInSlidingWindow(datapoints, windowsize).toString()
                  + '<br/> Time(ms): ' + timer.getTicks() + '</div>');
};

var createTimer = function(startTime){
    var timer = {};
    timer.startTime = startTime || new Date();
    timer.getTicks = function(endTime){ return (endTime || new Date()).getTime() - timer.startTime.getTime();  };
    timer.reset = function(newTime){ timer.startTime = newTime || new Date()};
    return timer;
};

var run = function(datapoints, windowsize, output){
    output.children().remove();

    datapoints && $(datapoints).each(function(idx){ 
        var node = $(this);
        evalSlidingWindow((node.val() || node.text()).split(' '), node.attr('windowsize') || windowsize.val(), node.attr('max'), output);        
    });
};
