# DrawingGameMERN
React.js + Express.js + MongoDb game


Application created with MERN (React + Express + Mongo + Node + Socket.io) stack.

First pages you see are the simple authorization pages (login and registration).
After registration first ever user will be 'admin' role.

Then you will see dashboard pages. Dashboard pages are:
-Home page - Short description about this application;
-Game page - 'Draw and guess' game page. Only admin is able to draw something in game. Other users just simply guessing the drawed word.
  After guessing the word, the other word from 'game words' list will be selected;
-Game words page - only for admin - list of words, that will be in guessing and drawing in game.
-Chat - Chat page. By default after first visiting page there will be created new chat to users with all users in database. 
  Later user will be able to create group chats. In chat user is able to send simple text message and images that will be stored to server page.
  Also you can like message that you want (not including your own message) and by hovering mouse see who set like to your message.
  You are also able to use custom context menu in your own messages and chats list in sidebar where your can delete/leave chat or invite users to it.
  Also you can set any sidebar width that you want by simply resizing it.
  
 -Todo list page - simple todo list;
 -Profile page - user profile page where you can change your data or add avatar;
 
