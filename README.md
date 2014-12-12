skitty
======
The Plug.dj bot for [Coding Soundtrack Lounge](http://plug.dj/coding-soundtrack-lounge/) that runs on [Meteor](https://www.meteor.com/)

## How To Use In 3 Easy Steps
1. Clone the Repo
2. Edit `packages/skitty-config/config.json` and update each field

   ``` json
   "con": {
        "attempts": 5,
        "delay": 1000,
        "room": "plugdj-room-name"
    },
    "auth": {
        "email": "plugdj-bot-acct-email",
        "password": "plugdj-bot-acct-pw"
    }
    ```
3. Launch app `sudo meteor`

## How To Deploy App to Server
This project uses [MUP](https://github.com/arunoda/meteor-up) to deploy any Meteor app to our own server

1. Install [MUP](https://github.com/arunoda/meteor-up#installation)
2. Edit `mup.json` and `settings.json`

    mup.json

    ``` json
    // Server authentication info
    "servers": [
    {
      "host": "hostname",
      "username": "root",
      "password": "password",
      //"sshOptions": { "Port" : 22 },
      "pem": "~/.ssh/id_rsa"
    }
    ],

    // Install MongoDB in the server, does not destroy local MongoDB on future setup
    "setupMongo": true,

    // WARNING: Node.js is required! Only skip if you already have Node.js installed on server.
    "setupNode": true,

    // WARNING: If nodeVersion omitted will setup 0.10.31 by default. Do not use v, only version number.
    "nodeVersion": "0.10.31",

    // Install PhantomJS in the server
    "setupPhantom": false,

    // Application name (No spaces)
    "appName": "meteor",

    // Location of app (local directory)
    "app": "/path/to/the/app",

    // Configure environment
    "env": {
    //"PORT": 3000
    "ROOT_URL": "http://myapp.com"
    },

    // Meteor Up checks if the app comes online just after the deployment
    // before mup checks that, it will wait for no. of seconds configured below
    "deployCheckWaitTime": 15
    ```

    settings.json

    ``` json
    "public": {},
    ```
    You can set settings for Meteor's [settings API](http://docs.meteor.com/#/full/meteor_settings)


If you frequent the room and wish to contribute, feel free open a pull request or issue.
Have fun!