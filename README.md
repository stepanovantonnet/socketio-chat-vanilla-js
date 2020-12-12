# Socket IO chat client and basic chat room

Vanila Javascript Chat Client based on webcomponents, shadow dom and internal templates for rendering performance.

## FEATURES

- [x] Input field to type and send messages
- [x] The user’s messages should be on the right and the other user’s
messages should be on the left
- [x] Each message has the time it was sent
- [x] button to send the message
- [x] Users can send pictures via URL. When sent, this URL is rendered on the
      message box as an image
- [x] Change username input field
- [x] Change clock display radio inputs
- [x] Send messages with Ctrl/Cmd + ENTER toggle
- [x] Have a text/link to reset all the settings back to its defaults
- [x] settings consumed and saved in the LocalStorage
- [x] message image parser

---

- [x] Chat room lobby with sample users selection
- [x] sample user avatars
- [x] random emoji button
- [x] demo messages

## Demo

![](chat-demo.gif)

## Installation instructions for command line

1. Clone this repository:

   ```bash
   git clone https://github.com/stepanovantonnet/socketio-chat-vanilla-js
   ```

2. Navigate to the cloned directory:

   ```bash
   cd socketio-chat-vanilla-js
   ```

3. Install dependencies:

   ```bash
   npm i
   ```

4. Start socketio and webserver:

   ```bash
   npm start
   ```

5. Navigate to:

   ```bash
   http://localhost:3000
   ```
