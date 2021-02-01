// loads first page data
changeData(1)
var flashcard = document.getElementById('flashcard');
var divBackStyle = document.getElementById('back');
var side = "front"
// var modes = ["", "", ""]
// var mode = 0
var frontContent = document.getElementById('flashcard--content_front');
var backContent = document.getElementById('flashcard--content_back');
var modesBtn = document.getElementsByClassName('modes')[0];
var previousBtn = document.getElementsByClassName('previous')[0];
var nextBtn = document.getElementsByClassName('next')[0];
var goodBtn = document.getElementsByClassName('good')[0];
var badBtn = document.getElementsByClassName('bad')[0];

// changeMode()

flashcard.addEventListener('click', flip, false);
// modesBtn.addEventListener('click', changeMode, false);
previousBtn.addEventListener('click', previousCard, false);
nextBtn.addEventListener('click', nextCard, false);
goodBtn.addEventListener('click', goodAnswer, false);
badBtn.addEventListener('click', randomCard, false);

/*
function changeMode() {
  var modeBtn = document.getElementById('mode');
  for (let index = 0; index < modes.length; index++) {
    if (modes[index] === modeBtn.innerText) {
      if (index === modes.length - 1) {
        mode = 0;
      } else {
        mode = index + 1;
      }
    }
  };
  modeBtn.innerText = modes[mode];
}
*/

function flip() {
  if (side === "back") {
    side = "front";
    // hide the text just before flip
    divBackStyle.style.fontSize = "0em";
  } else {
    side = "back";
    divBackStyle.style.fontSize = "3em";
  };
  flashcard.classList.toggle('flipped');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function changeData(page) {
  $.getJSON("https://spreadsheets.google.com/feeds/list/1fNDD5mBppIypEntyz0ITY9ibYD5NbflLzUqjDVYODgU/" + page + "/public/values?alt=json", function(data) {
  vocabWords = data.feed.entry;
  numVocabWords = vocabWords.length;
  document.title = "Flashcards - " + numVocabWords + " restantes"
  setCard(0)
 });
}

function setCard(num) {
  if (vocabWords.length === 0) {return;};
  newWord = vocabWords[num];
  var frontWord = newWord.gsx$jp.$t;
  var frontNotes = newWord.gsx$notesjp.$t;
  var backWord = newWord.gsx$fr.$t;
  var backNotes = newWord.gsx$notesfr.$t;

  frontContent.innerHTML = frontWord;
  if (frontNotes === "") {
    divBackStyle.style.paddingTop = "calc(50% - 2.4em)";
    frontContent.innerHTML = frontWord;
  } else {
    frontContent.innerHTML = frontWord + "<br />" + frontNotes;
    divBackStyle.style.paddingTop = "calc(50% - 3em)";
  };
  if (backNotes === "") {
    divBackStyle.style.paddingTop = "calc(50% - 2.4em)";
    backContent.innerHTML = backWord;
  } else {
    backContent.innerHTML = backWord + "<br />" + backNotes;
    divBackStyle.style.paddingTop = "calc(50% - 3em)";
  };
}

function getIndex(value) {
  for (let index = 0; index < vocabWords.length; index++) {
      if (vocabWords[index].gsx$jp.$t === value) {
          return index;
      }
  };
}

function randomCard() {
  if (side === "back") {flip()};
  if (vocabWords.length === 0) {return;};
  var randomNum = getRandomInt(0, numVocabWords);
  setCard(randomNum);
}

// ***PREV NEXT BUTTONS***
function previousCard() {
  if (vocabWords.length === 0) {return;};
  currentValue = frontContent.innerText.split("\n")[0]
  var currentIndex = getIndex(currentValue)
  if (currentIndex > 0) {
    setCard(currentIndex - 1);
  } else {
    setCard(vocabWords.length - 1);
  };
}

function nextCard() {
  if (vocabWords.length === 0) {return;};
  currentValue = frontContent.innerText.split("\n")[0]
  var currentIndex = getIndex(currentValue)
  if (currentIndex >= 0) {
    if (currentIndex === vocabWords.length - 1) {
      setCard(0);
    } else {
      setCard(currentIndex + 1);
    };
  };
}

function goodAnswer() {
  if (vocabWords.length === 0) {return;};
  currentValue = frontContent.innerText.split("\n")[0]
  var currentIndex = getIndex(currentValue)
  vocabWords.splice(currentIndex, 1);
  numVocabWords = vocabWords.length;
  document.title = "Flashcards - " + numVocabWords + " restantes"
  if (numVocabWords > 0) {
    randomCard()
  } else {
    frontContent.innerHTML = "Terminé";
    backContent.innerHTML = "Terminé";
  };
}
