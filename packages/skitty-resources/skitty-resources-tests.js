//Test resource loads on Server
if (Meteor.isServer) {
    var currentTest = null;

    var t = function(name, key) {
        var doc = SkittyResource.call(name, key);

        currentTest.ok(doc);
    }

    Tinytest.add('Skitty Resources', function(test) {
        currentTest = test;

        //run tests
        t('gifs', 'meow');
        t('quotes');
        t('funny_responses', 'magicWord');
        t('curmudgeon', 'generic');
        t('facts', 'catfacts');
        t('info', 'theme');

    });
}
