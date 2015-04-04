var utils = require('./utils.js');

exports.recipients = function(array){ //YZ: used in GetMessageList test case. For checking the to, cc, bcc field.
    for(var i = 0; i < array.length; i++){
        expect(array[i].email).toBe(jasmine.any(String));
        expect(array[i].firstName).toBe(jasmine.any(String));
        expect(array[i].lastName).toBe(jasmine.any(String));
    }
}

exports.emailAliases = function(array){ //YZ: used in GetUserContacts
    for(var i = 0; i < array.length; i++){
        expect(array[i].emailAddress).toBe(jasmine.any(String));
        expect(array[i].status).toBe(jasmine.any(String));
    }
}

jasmine.Matchers.prototype.toBeAnyOf = function(expecteds)
{
    this.message = function () {
        return "Expected '" + this.actual + "' to match one of: '" + expecteds ;
    }
    
    var result = false;
    for (var i = 0, l = expecteds.length; i < l; i++) {
        
        if (this.actual === expecteds[i]) {
            
            return true;
            break;
        }
    }
    
    this.spec.fail("Failure: Expected '" + this.actual + "' to match one of: " + expecteds);
};

exports.either = function (val, expected) {
    expect(val).toBeAnyOf(expected);
}

exports.StringOrEmptyString = function (val) {
    if (val != '')
        expect(val).toEqual(jasmine.any(String));
}

exports.StringOrUndefined = function(val){
    if(val == undefined){
        expect(val).toBe(undefined);
    } else {
        expect(val).toEqual(jasmine.any(String));
    }
}

jasmine.Matchers.prototype.toMatchBoolean = function(expecteds){
    var expected = (Boolean(expecteds)) ? 'True' : 'False';
    return (this.actual === expected);
}

exports.matchBoolean = function(val, expecteds){
    expect(val).toMatchBoolean(expecteds);
}
