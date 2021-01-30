changeData("hiragana")
var flashcard = document.getElementById('flashcard');
var divfrStyle = document.getElementById('back');
var side = "jp"
var jpContent = document.getElementById('flashcard--content_jp');
var frContent = document.getElementById('flashcard--content_fr');
var refreshBtn = document.getElementsByClassName('refresh');
var previousBtn = document.getElementsByClassName('previous');
var nextBtn = document.getElementsByClassName('next');

flashcard.addEventListener('click', flip, false);

for (i = 0; i < refreshBtn.length; i++) {
   refreshBtn[i].addEventListener('click', function(e) {
    if (side == "fr") {flip()};
    e.stopPropagation();
    e.preventDefault();
    var randomNum = getRandomInt(0, numVocabWords);
    setCard(randomNum)
  }, false);
}

for (i = 0; i < nextBtn.length; i++) {
  nextBtn[i].addEventListener('click', function(e) {
    nextCard()
 }, false);
}

for (i = 0; i < previousBtn.length; i++) {
  previousBtn[i].addEventListener('click', function(e) {
    previousCard()
 }, false);
}

function flip() {
  if (side == "fr") {
    side = "jp";
    // hide the text just before flip
    divfrStyle.style.fontSize = "0em";
  } else {
    side = "fr";
    divfrStyle.style.fontSize = "3em";
  };
  flashcard.classList.toggle('flipped');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function changeData(type) {
  var page = 1;
  if (type == "hiragana") {
    page = 1;
  } else if (type == "katakana") {
    page = 2;
  } else if (type == "kanji") {
    page = 3;
  };
  $.getJSON("https://spreadsheets.google.com/feeds/list/1fNDD5mBppIypEntyz0ITY9ibYD5NbflLzUqjDVYODgU/" + page + "/public/values?alt=json", function(data) {
  vocabWords = data.feed.entry;
  numVocabWords = vocabWords.length;
  setCard(0)
 });
}

function setCard(num) {
  newWord = vocabWords[num];
  jpContent.innerHTML = newWord.gsx$jp.$t;
  if (newWord.gsx$notes_jp.$t == "") {
    divfrStyle.style.paddingTop = "calc(50% - 2.4em)";
    jpContent.innerHTML = newWord.gsx$jp.$t;
  } else {
    jpContent.innerHTML = newWord.gsx$jp.$t + "<br />" + newWord.gsx$notes_jp.$t;
    divfrStyle.style.paddingTop = "calc(50% - 3em)";
  };
  if (newWord.gsx$notes_fr.$t == "") {
    divfrStyle.style.paddingTop = "calc(50% - 2.4em)";
    frContent.innerHTML = newWord.gsx$fr.$t;
  } else {
    frContent.innerHTML = newWord.gsx$fr.$t + "<br />" + newWord.gsx$notes_fr.$t;
    divfrStyle.style.paddingTop = "calc(50% - 3em)";
  };
}
function getIndex(value) {
  for (let index = 0; index < vocabWords.length; index++) {
      if (vocabWords[index].gsx$jp.$t === value) {
          return index;
      }
  };
}

// ***PREV NEXT BUTTONS***
function previousCard() {
  var currentIndex = getIndex(jpContent.innerText)
  if (currentIndex > 0) {
    setCard(currentIndex - 1);
  } else {
    setCard(vocabWords.length - 1);
  };
}

function nextCard() {
  var currentIndex = getIndex(jpContent.innerText)
  if (currentIndex >= 0) {
    if (currentIndex == vocabWords.length - 1) {
      setCard(0);
    } else {
      setCard(currentIndex + 1);
    };
  };
}
