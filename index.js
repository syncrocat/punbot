var RtmClient = require('@slack/client').RtmClient;
var config = require("./config.json");
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var keywords = require('./keywords.json');
var categories = require('./categories.json');
var bot_token = config.SLACK_BOT_TOKEN || '';
var PUN_CHANCE = 0.62;
var DIRECT_PUN_CHANCE = 0.75;

var rtm = new RtmClient(bot_token);

rtm.start();

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// Responds hello to peeps
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if (Math.random() < PUN_CHANCE) {
    var puns = getPunResponses(message);
    if (Math.random() < DIRECT_PUN_CHANCE) {
      var choice = Math.floor(Math.random() * puns.direct.length);
      var response = puns.direct[choice];
    } else {
      var choice = Math.floor(Math.random() * puns.indirect.length);
      var response = puns.indirect[choice];
    }
    rtm.sendMessage(response, message.channel);
  }
});

function getPunResponses(message) {
  var lines = []
  if (message.text) {
    var lines = message.text.match(/\w+/g);
  }
  var directResponses = [];
  var indirectResponses = [];
  // First find all direct responses and related categories
  for (i = 0; i < lines.length; i++) {
    var word = lines[i].toLowerCase();
    if (keywords[word]) {
      if (keywords[word].responses) {
        directResponses.push.apply(directResponses, keywords[word].responses);
      }
      if (keywords[word].categories) {
        // For each category, look up all appropriate responses
        for (j = 0; j < keywords[word].categories.length; j++) {
          var category = keywords[word].categories[i];
          if (categories[category] && categories[category].responses) {
            indirectResponses.push.apply(indirectResponses, categories[category].responses);
          }
        }
      }
    }
  }
  return {"direct": directResponses, "indirect": indirectResponses};
}
