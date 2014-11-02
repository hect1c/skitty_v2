skitty
======
The Plug.dj bot for [Coding Soundtrack Lounge](http://plug.dj/coding-soundtrack-lounge/) that runs on Node.js

## How To Use
1. Clone the Repo
2. Run `npm install` to install app dependencies
3. Run `bower install` to install frontend dependencies
3. Copy `config/plugdj.example.js` to `plugdj.js` and complete each field  

   ``` js
    module.exports = {
        room: '<plugdj-room-name>',
        auth: {
            email : '<account-email>',
            password : '<account-password>'
        }
    };
    ```
   
4. Fire up [MongoDB](http://www.mongodb.org/)
5. Launch app `grunt`

If you frequent the room and wish to contribute, feel free open a pull request or issue.
Have fun!
