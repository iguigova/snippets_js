exports.print = function(text) {
    console.log(JSON.stringify(text));
}

exports.capitalize = function(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
}

exports.format = function(text) { // http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
    var args = Array.prototype.slice.call(arguments, 1);

    return text.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number] 
            : match
        ;
    });
};

exports.formatGuid = function(guid) {
    return guid.replace(/\-/g, "").toLowerCase();
}

var parse = function(type){
    var letters = 'abcdefghiklmnopqrstuvwxyz';
    var numeric = '0123456789';
    var symbols = '[]{}()_-+=*&^%$#@!?/\<>|~'; 
    
    var alphaUpperCase = letters.toUpperCase(); 
    var alphaLowerCase = letters.toLowerCase();
    var alphaNumeric = alphaUpperCase + alphaLowerCase + numeric;
    
    var any = alphaNumeric + symbols;
   
    return eval(type || 'alphaNumeric').split('');
}

exports.random = function(length, type) {
    var chars = parse(type);
    var result = '';
    for (var i = 0; i < (length || Math.floor(Math.random() * chars.length)); i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}

exports.randomNumber = function(min, max) { // http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.rangeToArr = function(text){ // text is either a number or a range - note!: there is no input validation for now
    var result = [];

    var input = text.split('-');

    for (var i = parseInt(input[0]), l = parseInt(input[input.length - 1]); i <= l; i++){
        result.push(i);
    }
    
    return result;
}

exports.pagesToArr = function(pages){ // pages is a string containing individual pages and page ranges: e.g., 1, 4, 10-20, 32 - note!: there is no input validation for now
    var result = []

    var input = pages.split(',');

    for(var i = 0, l = input.length; i < l; i++){
        input[i] = this.rangeToArr(input[i]);
    }

    result = result.concat.apply(result, input); // http://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript

    return result;
}

var toAbsolutePath = function(path){
    return require('path').resolve(__dirname, path);
} 

var toContentType = function(type){
    switch(type){
        case 'gif':
        case 'jpg':
        case 'ico':
        case 'png': return 'image/' + type;
    }
}

exports.fileinfo = function(folder, name, type){
    var path = this.format('{0}{1}.{2}', folder, name, type);
    var absolutepath = toAbsolutePath(path);
    var contenttype = toContentType(type);

    return {
        name: name,
        type: type,
        contenttype: contenttype,
        path: path, 
        absolutepath: absolutepath
    };
}

exports.file = function(fileinfo, other){
    var fs = require('fs');
    var formdata = require('form-data');
    var form = new formdata();

    // console.log('File info: ' + JSON.stringify(fileinfo));

    form.append('File', fs.createReadStream(fileinfo.absolutepath), {
        filename: fileinfo.name,
        contentType: fileinfo.contenttype,                           // what should be the default?
        knownLength: fs.statSync(fileinfo.absolutepath).size         // we need to set the knownLength so we can call  form.getLengthSync()
    });

    for(var param in other){
        form.append(param, other[param]);
    }
    
    return form;
}
