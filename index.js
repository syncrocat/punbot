var RtmClient = require('@slack/client').RtmClient;
var config = require("./config.json");
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var keywords = require('./keywords.json');
var categories = require('./categories.json');
var bot_token = config.SLACK_BOT_TOKEN || '';
var PUN_CHANCE = 0.62;
var DIRECT_PUN_CHANCE = 0.75;
var inspect = require('unist-util-inspect');
var English = require('parse-english');
var natural = require('natural');
var rhyme = require('rhyme');

var rtm = new RtmClient(bot_token);

rtm.start();

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

// Responds hello to peeps
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  var botID = "U3AU23QNB";
  if( message.text.includes(botID)){
    handleDirectCallout(message);
  }
  else{
    var response = false;
    //rhymes("test", "two");
    //phoneticTest(message.text);
    //parseSentence(message.text);
    if (Math.random() < PUN_CHANCE) {
      var puns = getPunResponses(message.text);
      if (Math.random() < DIRECT_PUN_CHANCE) {
        console.log("Direct pun:", PUN_CHANCE * DIRECT_PUN_CHANCE, "in 1 chance");
        var choice = Math.floor(Math.random() * puns.direct.length);
        response = puns.direct[choice];
      } else {
        console.log("Indirect pun:", PUN_CHANCE * (1 - DIRECT_PUN_CHANCE), "in 1 chance");
        var choice = Math.floor(Math.random() * puns.indirect.length);
        response = puns.indirect[choice];
      }
      if (response) {
        console.log("f")
        rtm.sendMessage(response, message.channel);
      }
    } else {
      console.log("Not really feeling it");
    }
  }
});

function getPunResponses(text) {
  var lines = text.match(/\w+/g) || [];
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

// Responds hello to peeps
  /*if (message.text == "hello") {
      rtm.sendMessage("Hello <@" + message.user + ">!", message.channel);
  }*/

function handleDirectCallout(message){
  if(message.text.match(/(?=\sr\w*\s?:\s?)\w*\s*/) && message.text.match(/(?=\sc\w*\s?:\s?)\w*/)){
  var response = (message.text.match(/([^(r:)]+).*(?=c:)/))[0];
  var category = (message.text.match(/([^(c:)]+)\w*/))[0];
  console.log("RESPONSE" + response +"GODFOK");
  if(message.text.match(/\sk/)){
    var keyword = (message.text.match(/([^(k:)]+)\w*/))[0];
    var j = {"categories":[category],"response":[response]};
    addToJsonText("keywords.json", keyword, j);
    console.log("keywords has been added");
  }
  var j = {"responses":[response]};
  addToJsonText("categories.json", category, j);
}
else{
  rtm.sendMessage("sorry, I didn't understand you. What pun do I save?", message.channel);
}
}

function addToJsonText(filename, title, jsonString){
  var fs = require('fs');
  fs.readFile(filename, (err, data) => {

    var theD = JSON.parse(data);
    theD[title] = jsonString;

    fs.writeFile(filename, JSON.stringify(theD), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });

  if (err) throw err;
  console.log(data);
  });


}

function requestPun() {
  var fs = require('fs');
  var array = fs.readFileSync('file.txt').toString().split("\n");
  var rand = random(0, length(punsByRequest));
  rtm.sendMessage(array[rand], message.channel);
}

// function parseSentence(text) {
//   var parsedText = new English().parse(text);
//   console.log(inspect(parsedText));
// }
//
// function phoneticTest(text) {
//   var words = text.match(/\w+/g) || [];
//   console.log(words);
//   console.log(natural.Metaphone.compare(words[0], words[1]));
//   for (i = 0; i < words.length; i++) {
//     for (j = i + 1; j < words.length; j++) {
//       soundAlike(words[i], words[j]);
//     }
//   }
// }
//
// function soundAlike(wordA, wordB) {
//   while (wordA.length > 0 && wordB.length > 0) {
//     if (natural.Metaphone.compare(wordA, wordB)) {
//       console.log(wordA, "sounds like", wordB);
//       return true;
//     } else {
//       if (wordB.length > wordA.length) {
//         wordB = wordB.slice(1, wordB.length);
//       } else {
//         wordA = wordA.slice(1, wordA.length);
//       }
//     }
//   }
//   return false;
// }
//
// function rhymes(wordA, wordB) {
//   //console.log(rhyme(wordA));
//   rhyme(function (r) {
//       console.log(r.rhyme('bed'));
//   });
// }
