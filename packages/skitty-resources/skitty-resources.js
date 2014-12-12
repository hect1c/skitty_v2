//Instantiate object
SkittyResource = {};

/**
 * Renders appropriate resource file
 *
 * @param  {string} category Name of file to load
 * @param  {string} key      Key to be searched on
 *
 * @return {array}          Array of values from object
 */
SkittyResource.call = function(category, key) {
    var obj = Assets.getText('public/' + category + '.json');
    var obj_json = JSON.parse(obj);

    //If second parameter is key.key
    if (key) {
        if (key.indexOf('.') > -1) {
            var keys = key.split('.');

            var key1 = keys[0];
            var key2 = keys[1];
        }
    }

    if (keys) {
        return obj_json[key1][key2];
    } else if (key) {
        return obj_json[key];
    }

    return obj_json;
}
