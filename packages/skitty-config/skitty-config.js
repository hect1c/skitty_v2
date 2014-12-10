/**
 * Use api to get static skitty settings
 */
SkittyConfig = {};

//use Asset api to get text from file
var data = Assets.getText('config.json');
//parse data to JSON
var config = JSON.parse( data );

/**
 * Load configurations
 *
 * @return {object} Returns loaded file object
 */
SkittyConfig.load = function(){
    return config;
};

