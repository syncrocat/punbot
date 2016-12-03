var rhyme = require('rhyme');

function rhymes(wordA, wordB, callback) {
  //console.log(rhyme(wordA));
  rhyme(function (r) {
    var phoneticsA = r.pronounce(wordA)[0];
    var phoneticsB = r.pronounce(wordB)[0];
    console.log("Finding biggest match of:", phoneticsA, phoneticsB);
    var done = false;
    var i = 0;
    var best_score = 0;
    var best_index = 0;
    while (i < phoneticsA.length) {
      while (i < phoneticsA.length && !phoneticMatch(phoneticsA[i], phoneticsB[0])) {
        console.log(phoneticsA[i]);
        i += 1;
      }
      console.log("!", phoneticsA[i]);
      var current_score = subStringScore(phoneticsA.slice(i), phoneticsB);
      if (current_score > best_score) {
        best_score = current_score;
        best_index = i;
      }
      i += 1;
    }
    console.log(best_score, best_index);
    result = "asdf";
    callback(result);
  });
}

function test(wordA, wordB) {
  var response = null;
  rhymes(wordA, wordB, function(r) {
    console.log(wordA, wordB, r);
  });
}

function phoneticMatch(sound1, sound2) {
  //console.log(sound1, sound2);
  return sound1 == sound2 || sound1.length == 3 && sound2.length == 3 && sound1.slice(0, 2) == sound2.slice(0, 2);
}

function subStringScore(string1, string2) {
  var result = 0;
  var i_1 = 0;
  var i_2 = 0;
  while (i_1 < string1.length && i_2 < string2.length && phoneticMatch(string1[i_1], string2[i_2])) {
    result += 1;
    i_1 += 1;
    i_2 += 1;
  }
  return result;
}

test("tomato", "potato");
test("potato", "tomato");
test("red", "bed");
