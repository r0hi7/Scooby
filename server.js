var Botkit = require('botkit')
var XRegExp = require('xregexp')

parser = XRegExp(
  `(?<user> \<(.*)\>) -? # user
   (?<msg> .*)           # msg`,
  'x')

require('dotenv')
  .config()

var token = process.env.SLACK_TOKEN


var configuration = {
  retry: Infinity,
  send_via_rtm: true,
  interactive_replies: true
}

var controller = Botkit.slackbot(configuration);


if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
      token: token
    })
    .startRTM(function (err, bot, payload) {
      if (err) {
        console.log('Cloud not connect to Slack')
        throw new Error(err)
      }
      console.log('Connected to Slack RTM')
    })
} else {
  console.log('No slack token..')
}


function checkStatus(bot, message, user, username, userMsg, presence) {
  bot.api.users.getPresence({
    user: username.substring(1)
  }, (err, response) => {
    if (err) {
      console.log(err);
      bot.replyWithTyping(
        'Currently server is overloaded.. Please try after some time'
      );
      return;
    }
    presence = response.presence
    if (presence != 'active')
      setTimeout(() => {
        checkStatus(bot, message, user, username, userMsg,
          presence)
      }, 10000)
    else if (presence == 'active') {
      bot.replyWithTyping(message, user + ' is *online* now.')
      if (userMsg)
        bot.replyWithTyping(message,
          'And this is what you asked me to remind *' + userMsg +
          '*')
    }
  });
}

controller.hears(['notify'], 'direct_message,direct_mention,mention',
  function (
    bot, message) {
    try {
      user = XRegExp.exec(message.text, parser)
        .user;
      msg = XRegExp.exec(message.text, parser)
        .msg;
      username = user.substring(1, user.length - 1);

      bot.api.users.getPresence({
        user: username.substring(1)
      }, (err, response) => {
        if (response.presence == 'active') {
          bot.replyWithTyping(message, user +
            'is already online');
          return;
        } else {
          bot.replyWithTyping(message,
            "I will notify you when " + user +
            " will be online.");
          if (msg)
            bot.replyWithTyping(message,
              'And will delive you the same message to remind you about why you were looking for ' +
              user + ' to come online');
          checkStatus(bot, message, user, username, msg, 'away')
        }
      });
    } catch (TypeError) {
      bot.replyWithTyping(message,
        'I did not understand what did you say !! :confused:');
      bot.replyWithTyping(message,
        'May be you should look for the username !')
      bot.replyWithTyping(message,
        'You can use the following format `notify @<username> [<message>]`'
      );
    }
  });


controller.on('channel_join', function (bot, message) {
  bot.replyWithTyping(message,
    "Thanks for Inviting to the channel.. :smile:");
  bot.replyWithTyping(message,
    'You can use the following format `@test_online notify @<username> [<message>]`'
  );
});
