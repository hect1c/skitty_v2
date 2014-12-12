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

If you frequent the room and wish to contribute, feel free open a pull request or issue.
Have fun!