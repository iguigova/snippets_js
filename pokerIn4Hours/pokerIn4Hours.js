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
    var kickers = function(idx){ // http://en.wikipedia.org/wiki/Kicker_(poker)        
        idx = idx || -15; 
        var notplayed = Math.max(input.length - 1/*player input*/ - 5, 0);
        return function(all, cardinality, rank) {
            return (all || 0) + (((cardinality == 1) && (notplayed-- <= 0)) ? rank * Math.pow(10, ++idx) : 0);
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
    var sd = Math.min(cards(14), 1); // straight discriminant: count A as 1 or 14
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

    var score = function(cond, bigendian, littleendian) { return (cond ? 1 : 0) * (bigendian + littleendian); }; 

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

var evalGame = function(input, output, params){
    var timer = createTimer();

    var winner = {player: '', score: 0};
    for (var i = 0, len = input.length || input; i < len; i++)
    {
        var hand = evalHand(input[i] || createHand(params)) || {};
        if (winner.score <= hand.score){
            winner.player += ', ' + hand.player; 
            winner = (winner.score < hand.score) ? hand : winner;
        }
    }

    output.append('<div><br/>Test [' + params + ']: ' + input 
                  + '<br/> Winner: <b>' + winner.player + '</b>'
                  + '<br/> Score: ' + winner.score 
                  + '<br/> Time(ms): ' + timer.getTicks() + '</div>');
};

// Assumptions: 
// (1) The highest ranking hand (as per the standard poker hand ranking system, http://en.wikipedia.org/wiki/List_of_poker_hands) is the winning hand. There is always at least one winner.
// (2) The number of hands is a positive random integer.
// (3) The number of cards in a hand is a positive random integer less than 13. The number of cards in a hand does not really matter but it makes sense that it would not exceed 13.
// (4) The cards in a hand come from one deck. The process can be modified to support multiple decks but it will loose some of its transparency.
// (5) Each card is represented by 2-letter words, where the 1st letter identifies the rank (i.e., is in the set [1..10, J, Q, K, A]) and the 2nd letter identifies the suite (i.e., is in the set [D, H, C, S])
// (6) The input contains, per row, the name of the player and the set of cards that form the player's hand where entities are comma-separated. Multiple rows indicated multiple players. No checks are added to verify that the players are unique, have the same number of cards, and use one deck of cards.
// (7) The player name does not contain spaces; if it does, they will not be present in the output.

// TODO: Provide error handling, stats?
  
var createTimer = function(startTime){
    var timer = {};
    timer.startTime = startTime || new Date();
    timer.getTicks = function(endTime){ return (endTime || new Date()).getTime() - timer.startTime.getTime();  };
    timer.reset = function(newTime){ timer.startTime = newTime || new Date()};
    return timer;
};

var createHand = function(numofcards){
    if (isNaN(numofcards)) return;

    var rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    var suite = ['D', 'H', 'C', 'S'];
    var ridx = function(m){ return (Math.round((Math.random()*Math.pow(10, 4))) % (m -1)) + 1; };
    var card = function(){ return rank[ridx(13)] + suite[ridx(4)]; };
    var hand = 'R';
    for (var i = 0; i < numofcards; i++, hand += ',' + card()) {}
    return hand;
};

var runGame = function(selector, output, params){
    output.children().remove(); //$(output + ' > *').remove();

    selector && $(selector).each(function(idx){ 
        var node = $(this);
        evalGame((node.text() || node.val()).split('\n'), output, node.attr('winner'));
    });

    params = params || {};
    for (var j = 0; j < (params.exp || 0); j++){
        evalGame(Math.pow(10, j), output, params.numofcards);
    }
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

