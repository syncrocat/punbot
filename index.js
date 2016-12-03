var RtmClient = require('@slack/client').RtmClient;
var config = require("./config.json");
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var keywords = require('./keywords.json');
//var categories = require('./categories.json');
var bot_token = config.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

rtm.start();

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// Responds hello to peeps
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  var channel = "#general"; //could also be a channel, group, DM, or user ID (C1234), or a username (@don)
  var lines = message.text.match(/\w+/g);
  console.log(lines);
  var possibleResponses = [];
  for (i = 0; i < lines.length; i++) {
    var word = lines[i].toLowerCase();
    console.log("For word: ", word, "...");
    var responses = []
    if (keywords[word] && keywords[word].responses) {
        responses = keywords[word].responses;
      }
    }
    console.log("...the responses are: ", responses);
    
  }
  /*if (message.text == "hello") {
      rtm.sendMessage("Hello <@" + message.user + ">!", message.channel);
  }*/
});
