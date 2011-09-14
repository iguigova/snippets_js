
var ph = ph || {};

ph.ensureNVPConfig = function(config){
    return ph.apply({nvdelim: '=', pdelim: '&'}, config);
};

// Implode object to name-value concatenated string
ph.toNVP = function(json, config){
    if (!json) return;

    config = ph.ensureNVPConfig(config);

    var data = '';    

    // Concatenate all properties -
    //  . Excess props are not excluded
    //  . Nested NVP are not detected and will most likely cause a problem when de-parsed
    for (var prop in json){
        if (json.hasOwnProperty(prop)){
            data = data + prop + config.nvdelim + json[prop] + config.pdelim;
        }
    }
    
    // Remove a trailing '&'
    if (data[data.length - 1] == config.pdelim){
        data = data.slice(0, data.length - 1);
    }
    
    // print('ph.toNVP: ' + data); 
    
    return data;
};

// Explode name-value string to an object; cf. Request.params, Controller.getParams()
ph.fromNVP = function(json, config){
    if (!json) return;

    config = ph.ensureNVPConfig(config);

    var data = {};
    var pairs = json.split(config.pdelim);

    for (var i = 0, len = pairs.length; i < len; i++){
        var nvp = /([^=]*?)=(.*)/.exec(pairs[i]);
        data[nvp[1]] = nvp[2];
    }

    // print('common-ph.js fromNVP: ' + JSON.stringify(data));

    return data;
};

// Convert object to name-value array
ph.toNVA = function(json){
    var arr = [];

    for (var prop in json){
        if (json.hasOwnProperty(prop)){
            arr.push({name: prop, value: json[prop]});
        }
    }

    return arr;
};

if (typeof window != 'undefined')
    exports = {};

exports.ph = ph;