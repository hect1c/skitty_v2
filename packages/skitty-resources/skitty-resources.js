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
SkittyResource.call = function(category, key){
    var obj = Assets.getText('public/'+ category +'.json');
    var obj_json = JSON.parse( obj );

    if( key ){
        return obj_json[key];
    }

    return obj_json;
}