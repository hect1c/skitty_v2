//load app settings
var config = SkittyConfig.load(),
    db = SkittyDb,
    //load modules
    modules = [
        new Skitty,
        new SkittyCurmudgeon,
        new SkittyInfo,
        new SkittyKillSwitch,
        new SkittyStats,
        new SkittyDj
    ],
    //run app
    skitty = SkittyPlugApi.run(config, modules);
