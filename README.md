skitty
======
The Plug.dj bot for [Coding Soundtrack Lounge](http://plug.dj/coding-soundtrack-lounge/) that runs on Node.js

## How To Use

1. Clone the Repo
2. Run ```npm install``` to get all the dependancies.
3. Copy appTemplate.js, create a new file and add your bots info and room info.
    ```
    var model = {
            room: '<roomname>', //Name of Plug.dj room
            auth: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx=?_expires=xxxxxxxxxxxxxxxxxx==&user_id=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=', // Put your auth token here, it's the cookie value for usr
            reconnectDelay: 1000,
            reconnectAttempts: 5
      },
    ```
    This is the file that you will run.
    After you have your app.js file setup, go ahead and start it up on a node server. (from CLI in the root of the bot run "node app.js")

If you frequent the room feel free to send me a pull request.
Have fun!
