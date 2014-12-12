//load app settings
var config = SkittyConfig.load(),
    //load modules
    modules = [
        new Skitty(),
        new SkittyCurmudgeon(),
        new SkittyInfo,
        new SkittyKillSwitch
    ],
    //run app
    skitty = SkittyPlugApi.run(config, modules);
