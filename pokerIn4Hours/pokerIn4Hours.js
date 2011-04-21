//$(function() {
var evalHand = function(input){
    if (!input) return;
    input = input.replace(/\s+/g, '').replace(/,[Jj]/g, ',11').replace(/,[Qq]/g, ',12').replace(/,[Kk]/g, ',13').replace(/,[Aa]/g, ',14').toUpperCase().split(',');

    var hand = {D: [], H: [], C: [], S:[]};
    for (var i = 1, len = input.length; i < len; i++)
    {
        input[i] && (hand[input[i].slice(input[i].length - 1)][input[i].slice(0, input[i].length - 1)] = 1); 
    }

    var card = function(suite, rank){return hand[suite][rank] || 0};
    var cards = function(rank){ return card('D', rank) + card('H', rank) + card('C', rank) + card('S', rank); };
    var kickers = function(idx){ 
        idx = idx || -15;  
        return function(all, cardinality, rank) {
            rank = (cardinality === 1) ? rank : 0; 
            idx += (cardinality === 1) ? 1 : 0;;
            return (all || 0) + rank * Math.pow(10, idx);                                           
        };
    }();
   
    var tag = function(a, b, always) {a = a || 0; b = Math.min(b || 0, 1); return (b || always) ? a + b : 0};
    var reset = function(a) { return (a < 5) ? 0 : a};

    var cardsofrank = []; 
    var hc = 0;         // high card
    var k4 = 0;         // four of a kind 
    var k3 = 0;         // three of a kind
    var p2 = 0;         // two pair / two one pairs
    var p1 = 0;         // one pair / two of a kind
    var k = 0;          // kickers
    var sd = cards(14); // straight discriminant: count A as 1 or 14
    for (var i = 2; i < 15; i++)
    {
        cardsofrank[i] = cards(i);
        hc = (cardsofrank[i]) ? i * Math.pow(10, -4) : hc;
        k4 = (cardsofrank[i] === 4) ? hc : k4;
        k3 = (cardsofrank[i] === 3) ? hc : k3;
        p2 = (cardsofrank[i] === 2) ? p1 : p2;
        p1 = (cardsofrank[i] === 2) ? hc : p1; 
        k = kickers(k, cardsofrank[i], i);
        sd = tag(sd, cardsofrank[i], sd >= 5);
    };
    var s = reset(sd); // straight

    if (s && cards(14) && !cards(13)) { k = k - 14 * Math.pow(10, sd); } // adjust for A as 1 or 14

    var cardsofsuite = {D: 0, H: 0, C: 0, S: 0};
    for (var i = 2; i < 15; i++)
    {
        cardsofsuite['D'] = tag(cardsofsuite['D'], card('D', i), true);
        cardsofsuite['H'] = tag(cardsofsuite['H'], card('H', i), true);
        cardsofsuite['C'] = tag(cardsofsuite['C'], card('C', i), true);
        cardsofsuite['S'] = tag(cardsofsuite['S'], card('S', i), true);
    }
    var f = reset(cardsofsuite['D']) + reset(cardsofsuite['H']) + reset(cardsofsuite['C']) + reset(cardsofsuite['S']);  // flush

    var score = function(cond, bigendian, littleendian) {
        return (cond ? 1 : 0) * (bigendian + littleendian);
    }; 

    return {
        player: input[0],  
        score: (score(s && f, 8, k)                              // straightflush
                || score(k4, 7, k4)                              // fourofakind
                || score(p1 && k3, 6, p1 + k3 * Math.pow(10, 2)) // fullhouse
                || score(f, 5, k)                                // flush
                || score(s, 4, k)                                // straight
                || score(k3, 3, k3)                              // threeofakind
                || score(p2, 2, p2 + p1 * Math.pow(10, 2))       // twopair
                || score(p1, 1, p1))                             // onepair
            + score(hc, 0, k)                                    // highcard - tie breaker
    };
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
// (0) there's always at least one winner
// (1) the number of hands is a positive random integer
// (2) the number of cards in a hand is a positive random integer less than 13
// (3) the hands may have cards from more than one deck
// (4) duplicate cards within a hand are ignored (from the score)
// (5) each card is represented by 2-letter words, where the 1st letter identifies the rank (i.e., is in the set [1..10, J, Q, K, A]) and the 2nd letter identifies the suite (i.e., is in the set [D, H, C, S])
// (6) the input contains the name of the player and the set of cards that form the player's hand where entities are comma-separated. 
// (7) the player name does not contain spaces; if it does, they will not be present in the output (while the result will still be correct)

// TODO: Provide error handling, stats?
  
var createTimer = function(startTime){
    var timer = {};
    timer.startTime = startTime || new Date();
    timer.getTicks = function(endTime){ return (endTime || new Date()).getTime() - timer.startTime.getTime();  };
    timer.reset = function(newTime){ timer.startTime = newTime || new Date()};
    return timer;
};

//});

// Debugging: 
    // console.info('f ' + f);
    // console.info('k4 ' + k4);
    // console.info('k3 ' + k3);
    // console.info('p2 ' + p2);
    // console.info('p1 ' + p1);
    // console.info('hc ' + hc);
    // console.info('k ' + k);
    // console.info('sd ' + sd);
    // console.info('s ' + s);

    // console.info((score(s && f, 8, k)                            // straightflush
    //             || score(k4, 7, k4)                              // fourofakind
    //             || score(p1 && k3, 6, p1 + k3 * Math.pow(10, 2)) // fullhouse
    //             || score(f, 5, k)                                // flush
    //             || score(s, 4, k)                                // straight
    //             || score(k3, 3, k3)                              // threeofakind
    //             || score(p2, 2, p2 + p1 * Math.pow(10, 2))       // twopair
    //             || score(p1, 1, p1))                             // onepair
    //     + score(hc, 0, k));

