//$(function() {
var evalHand = function(input){
    if (!input) return;
    input = input.replace(/\s+/g, '').replace(/,[Jj]/g, ',11').replace(/,[Qq]/g, ',12').replace(/,[Kk]/g, ',13').replace(/,[Aa]/g, ',14').split(',');

    var hand = {};
    hand['D'] = [];
    hand['H'] = [];
    hand['C'] = [];
    hand['S'] = [];
    for (var i = 1, len = input.length; i < len; i++)
    {
        input[i] && (hand[input[i].slice(input[i].length - 1)][input[i].slice(0, input[i].length - 1)] = 1); 
    }
    var col = function(c){ return (hand['D'][c]||0) + (hand['H'][c]||0) + (hand['C'][c]||0) + (hand['S'][c]||0)};


    var tag = function(a, b, always) {a = a || 0; b = Math.min(b || 0, 1); return (b || always) ? a + b : 0};
    var reset  = function(a) { return (a < 5) ? 0 : a};
    var acc = function(idx){ 
        idx = idx || -1;  
        return function(a, m, b) {
            b = (m === 1) ? b : 0; 
            idx += (b) ? 1 : 0;
            return (a || 0) + (b || 0) * Math.pow(10, Math.min(idx, 8));                                             
        };
    }();

    var y = [];  // calculate based on card rank
    var k4 = 0;  // four of a kind 
    var k3 = 0;  // three of a kind
    var p2 = 0;  // two pair / two one pairs
    var p1 = 0;  // one pair / two of a kind
    var hc = 0;  // high card
    var sd = col(14);  // straight discriminant // count A as 1 or 14
    var fd = 0;  // flush discriminant
    for (var i = 2; i < 15; i++)
    {
        y[i] = col(i);
        k4 = (y[i] === 4) ? i : k4;
        k3 = (y[i] === 3) ? i * Math.pow(10, 2) : k3;
        p2 = (y[i] === 2) && p1 ? p1 + i * Math.pow(10, 2) : p2;
        p1 = (y[i] === 2) ? i : p1; 
        hc = (y[i]) ? i : hc;
        sd = tag(sd, y[i], sd >= 5);
        fd = acc(fd, y[i], i);
    };
    var fh = p1 + k3; // fullhouse
    var s = reset(sd); // straight

    if (s && col(14) && !col(13)) { fd = fd - 14*10000; } // adjust for A as 1 or 14

    var x = []; // calculate based on suite
    for (var i = 2; i < 15; i++)
    {
        x['D'] = tag(x['D'], hand['D'][i], true);
        x['H'] = tag(x['H'], hand['H'][i], true);
        x['C'] = tag(x['C'], hand['C'][i], true);
        x['S'] = tag(x['S'], hand['S'][i], true);
    }
    var f = reset(x['D']) + reset(x['H']) + reset(x['C']) + reset(x['S']);  // flush

    console.info(y);
    console.info(x);
    console.info('k4 ' + k4);
    console.info('p1 + k3 ' + p1 + k3);
    console.info('fd ' + fd);
    console.info('sd ' + sd);
    console.info('s ' + s);
    console.info('k3 ' + k3);
    console.info('p2 ' + p2);
    console.info('p1 ' + p1);
    console.info('hc ' + hc);

    var rlt = function(cond, bigendian, littleendian, p) {return (cond ? 1 : 0) * (bigendian + Math.pow(10, (p || -4)) * littleendian);}; 
    var straightflush = rlt(f && s, 8, fd, -8);
    var fourofakind = rlt(k4, 7, k4);
    var fullhouse = rlt(p1 && k3, 6, p1 + k3);
    var flush = rlt(f, 5, fd, -8);
    var straight = rlt(s, 4, fd, -8);
    var threeofakind = rlt(k3, 3, k3);
    var twopair = rlt(p2, 2, p2);
    var onepair = rlt(p1, 1, p1);
    var highcard = rlt(hc, 0, fd, -8);

    var pc = (straightflush || fourofakind || fullhouse || flush || straight || threeofakind || twopair || onepair) + highcard;
    console.info('score' + pc); 
    console.info('straightflush ' + straightflush);
    console.info('fourofakind' + fourofakind);
    console.info('fullhouse' + fullhouse);
    console.info('flush' + flush);
    console.info('straight' + straight);
    console.info('threeofakind' + threeofakind);
    console.info('twopair' + twopair);
    console.info('onepair' + onepair);
    console.info('highcard' + highcard);

    return {player: input[0],  score: pc};

//    return {player: input[0],  score: hc + k2 + k3 + Math.pow(10, flush) * hc};
};

var runGame = function(selector, output){

    output.children().remove(); //$(output + ' > *').remove();

    $(selector).each(function(idx){ 

        var node = $(this);
        var input = node.text() || node.val();
        var hands = input.split('\n');

        var timer = createTimer();

        var winner = {};
        for (var i = 0, len = hands.length; i < len; i++)
        {
            var hand = evalHand(hands[i]) || {};
            winner = ((winner.score || 0) < hand.score) ? hand : winner;
            winner.player += ((winner.score == hand.score) ? ', ' + hand.player : '');
        }

        output.append('<div><br/>Test: ' +  node.attr('id') + ' ' + (node.attr('winner') || '') + ': ' + input + '<br/> Winner: <b>' + winner.player.split(',').slice(1) + '</b><br/> Score: ' + winner.score + '<br/> Time(ms): ' + timer.getTicks() + '</div>');
    });
};

// Assumptions: 
// (1) the number of hands is a positive random integer
// (2) the number of cards in a hand is a positive random integer
// (3) the hands may have cards from more than one deck
// (4) duplicate cards within a hand are ignored (from the score)
// (5) each card is represented by 2-letter words, where the 1st letter identifies the rank (i.e., is in the set [1..10, J, Q, K, A]) and the 2nd letter identifies the suite (i.e., is in the set [D, H, C, S])
// (6) the input contains the name of the player and the set of cards that form the player's hand where entities are comma-separated. 
// (7) the player name does not contain spaces; if it does, they will not be present in the output (while the result will still be correct)
// TODO: Provide error handling
  
var createTimer = function(startTime){
    var timer = {};
    timer.startTime = startTime || new Date();
    timer.getTicks = function(endTime){ return (endTime || new Date()).getTime() - timer.startTime.getTime();  };
    timer.reset = function(newTime){ timer.startTime = newTime || new Date()};
    return timer;
};

//});

// Debugging: 
