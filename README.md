# Scooby

Scooby is open source Slack bot application that can ping you back when the member of your team you are looking for, comes online. At times you need the to interact with recipient to become online and proceed for the interaction, but Slack donot provide any inbuilt way of doing it.  

Scooby can help you on those scenarios. Scooby lookups for your teammates when they become active in Slack. And sends you a notification if you have to talk with somebody instantly in live chat or by phone. This is self-hosted with minimal dependencies solution for such situations.  

You can host is locally, you just to do very minimal changes to get it working with few clicks.
- Change the line `SLACK_TOKEN=<YOUR_SLACK_BOT_USER_TOKEN>` to the something like `SLACK_TOKEN=xoxb-xxxxxxxx-xxxxxxxxxx` in file `.env`
- `npm install` will install deps for you.
- `npm start` will start the bot for you.

One your bot is running you just need to fire query to bot like:  
    `notify @username [<message>]`  
Here message is the message that you want to convey/remind to your when the user with username comes online.
You can get the bot user token from : [Slack](https://api.slack.com/apps)


