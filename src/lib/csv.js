    
    
/**
* $.csv.fromArrays(arrays)
* Converts a javascript array to a CSV String.
*
* @param {Array} arrays An array containing an array of CSV entries.
* @param {Object} [options] An object containing user-defined options.
* @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
* @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
*
* This method generates a CSV file from an array of arrays (representing entries).
*/


const defaults = {
    separator: ',',
    delimiter: '"',
} 


/**
* $.csv.fromArrays(arrays)
* Converts a javascript array to a CSV String.
*
* @param {Array} arrays An array containing an array of CSV entries.
* @param {Object} [options] An object containing user-defined options.
* @param {Character} [separator] An override for the separator character. Defaults to a comma(,).
* @param {Character} [delimiter] An override for the delimiter character. Defaults to a double-quote(").
*
* This method generates a CSV file from an array of arrays (representing entries).
*/
function fromArrays(arrays, options, callback) {
    // if callback was passed to options swap callback with options
    if (options !== undefined && typeof (options) === 'function') {
        if (callback !== undefined) {
        return console.error('You cannot 3 arguments with the 2nd argument being a function');
        }
        callback = options;
        options = {};
    }

    options = (options !== undefined ? options : {});
    var config = {};
    config.callback = ((callback !== undefined && typeof (callback) === 'function') ? callback : false);
    config.separator = 'separator' in options ? options.separator : defaults.separator;
    config.delimiter = 'delimiter' in options ? options.delimiter : defaults.delimiter;

    var output = '';
    var line;
    var lineValues;
    var i;
    var j;

    for (i = 0; i < arrays.length; i++) {
        line = arrays[i];
        lineValues = [];
        for (j = 0; j < line.length; j++) {
        var strValue = (line[j] === undefined || line[j] === null) ? '' : line[j].toString();
        if (strValue.indexOf(config.delimiter) > -1) {
            strValue = strValue.replace(new RegExp(config.delimiter, 'g'), config.delimiter + config.delimiter);
        }

        var escMatcher = '\n|\r|S|D';
        escMatcher = escMatcher.replace('S', config.separator);
        escMatcher = escMatcher.replace('D', config.delimiter);

        if (strValue.search(escMatcher) > -1) {
            strValue = config.delimiter + strValue + config.delimiter;
        }
        lineValues.push(strValue);
        }
        output += lineValues.join(config.separator) + '\r\n';
    }

    // push the value to a callback if one is defined
    if (!config.callback) {
        return output;
    } else {
        config.callback('', output);
    }
}
  
export {fromArrays };