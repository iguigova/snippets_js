//$(function() {
var evalHand = function(input){
    if (!input) return;
    input = input.replace(/\s+/g, '').replace(/,[Jj]/g, ',11').replace(/,[Qq]/g, ',12').replace(/,[Kk]/g, ',13').replace(/,[Aa]/g, ',14').split(',');

    var hand = [];
    hand['D'] = [];
    hand['H'] = [];
    hand['C'] = [];
    hand['S'] = [];
    for (var i = 1, len = input.length; i < len; i++)
    {
        input[i] && (hand[input[i].slice(input[i].length - 1)][input[i].slice(0, input[i].length - 1)] = 1); 
    }

    var y = [];  // calculate based on card face
    var hc = 0;  // high card
    var k2 = 0;  // two of a kind
    var k3 = 0;  // three of a kind
    for (var i = 2; i < 15; i++)
    {
        y[i] = (hand['D'][i]||0) + (hand['H'][i]||0) + (hand['C'][i]||0) + (hand['S'][i]||0);
        hc = (y[i]) ? i : hc;
        k2 = (y[i] === 2) ? Math.pow(10, 2) * i : k2;
        k3 = (y[i] === 3) ? Math.pow(10, 3) * i : k3;
    };

    var x = []; // calculate based on suite
    var xfunc = function(a, b){ a = a || 0; b = b || 0; return a + b; }; 
    var xrlt = function(a) { return (a < 5) ? 0 : a};
    for (var i = 2; i < 15; i++)
    {
        x['D'] = xfunc(x['D'], hand['D'][i]);
        x['H'] = xfunc(x['H'], hand['H'][i]);
        x['C'] = xfunc(x['C'], hand['C'][i]);
        x['S'] = xfunc(x['S'], hand['S'][i]);
    }
    var flush = xrlt(x['D']) + xrlt(x['H']) + xrlt(x['C']) + xrlt(x['S']);     

    return {player: input[0],  score: hc + k2 + k3 + Math.pow(10, flush) * hc};
};


var runGame = function(selector, output){

    output.children().remove(); //$(output + ' > *').remove();

    $(selector).each(function(idx){ 

        var node = $(this);
        var input = node.text() || node.val();
        var hands = input.split('\n');

        var winner = {};
        for (var i = 0, len = hands.length; i < len; i++)
        {
            var hand = evalHand(hands[i]) || {};
            winner = ((winner.score || 0) < hand.score) ? hand : winner;
            winner.player += ((winner.score == hand.score) ? ', ' + hand.player : '');
        }

        output.append('<div><br/>Test: ' +  node.attr('id') + ' ' + (node.attr('winner') || '') + ': ' + input + '</br> Winner: <b>' + winner.player.split(',').slice(1) + '</b></br> Score: ' + winner.score + '</div>');
    });
};

// Assumptions: 
// (1) the number of hands is a positive random integer
// (2) the number of cards in a hand is a positive random integer
// (3) the hands may have cards from more than one deck
// (4) duplicate cards within a hand are ignored (from the score)
// (5) each card is represented by 2-letter words, where the 1st letter identifies the face (i.e., is in the set [1..10, J, Q, K, A]) and the 2nd letter identifies the suite (i.e., is in the set [D, H, C, S])
// (6) the input contains the name of the player and the set of cards that form the player's hand where entities are comma-separated. 
// (7) the player name does not contain spaces; if it does, they will not be present in the output (while the result will still be correct)
// TODO: Provide error handling

//});