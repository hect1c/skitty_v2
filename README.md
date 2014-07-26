skitty
======
The Plug.dj bot for [Coding Soundtrack Lounge](http://plug.dj/coding-soundtrack-lounge/) that runs on Node.js

## How To Use
1. Clone the Repo
2. Run `npm install` to get all the dependencies.
3. Copy `config.example.js` to `config.js` and complete each field.

   ``` js
    module.exports = {
        plug : {
            room : 'room-name',
            auth : 'usr-cookie-value'
        },
        mongo : 'mongodb://<USER>:<PASS>@<HOST/IP>:<PORT>/<DB NAME>'
    };
    ```
    
    To find your usr-cookie-value, check out [this](https://github.com/TATDK/plugapi/wiki/How-to-get-your-auth-token) tutorial.
4. Fire up [MongoDB](http://www.mongodb.org/)
5. Launch bot `node app.js`

If you frequent the room and wish to contribute, feel free open a pull request or issue.
Have fun!
