const idBunch = document.querySelector("#idBunch").value;
const level = document.querySelector("#level").value;
const limitWords = document.querySelector("#limitWords").value;

function getAllFiches(idBunch) {
  return new Promise((resolve, reject) => {
    fetch(`/fiches/${idBunch}/play/${level}/${limitWords}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        resolve(data);
      });
  });
}

class Card {
  constructor(id, word, translate, sentence, translateSentence) {
    this.id = id;
    this.word = word;
    this.translate = translate;
    this.sentence = sentence;
    this.translateSentence = translateSentence;
  }
  show(isFront) {
    let chit = document.querySelector(".fiszka");
    if (isFront) {
      let word = document.createElement("h3");
      word.classList.add("word");
      word.innerText = this.word;
      chit.appendChild(word);
      let sentence = document.createElement("p");
      sentence.classList.add("sentence");
      sentence.innerText = this.sentence;
      chit.appendChild(sentence);
      const getTranslateButton = document.createElement("a");
      getTranslateButton.id = "get-translate-button";
      getTranslateButton.innerText = "Show Back site";
      chit.appendChild(getTranslateButton);
    } else {
      let translate = document.createElement("h3");
      translate.classList.add("word");
      translate.innerText = this.translate;
      chit.appendChild(translate);
      let translateSentence = document.createElement("p");
      translateSentence.classList.add("sentence");
      translateSentence.innerText = this.translateSentence;
      chit.appendChild(translateSentence);
      const getWordButton = document.createElement("a");
      getWordButton.id = "get-word-button";
      getWordButton.innerText = "Show Front site";
      chit.appendChild(getWordButton);
    }
    let knowbutton = document.createElement("a");
    knowbutton.classList.add("know-button");
    chit.appendChild(knowbutton);
    let unknowbutton = document.createElement("a");
    unknowbutton.classList.add("unknow-button");
    chit.appendChild(unknowbutton);
    let unknowIcon = document.createElement("i");
    unknowIcon.classList.add("material-icons");
    unknowIcon.innerText = "reply";
    unknowbutton.appendChild(unknowIcon);
    let knowIcon = document.createElement("i");
    knowIcon.classList.add("material-icons");
    knowIcon.innerText = "done";
    knowbutton.appendChild(knowIcon);
  }
}

class Colection {
  constructor(id, cards) {
    this.id = id;
    this.cards = cards.map(el => {
      return Object.assign(el, { quantityOfRepeats: -1 });
    });
    this.idOfCard = 0;
    this.x = 0;
    this.Y = 0;
    this.isFront = false;
    this.quantityOfCards = cards.length;
    this.quantityOfLoops = 0;
    this.quantityOfSlice = 0;
  }

  pass() {
    this.cards[this.idOfCard].quantityOfRepeats = this.quantityOfLoops;
    const tempCards = this.cards.filter(el => el.quantityOfRepeats != -1);
    console.log(tempCards);
    if (tempCards.length === 0) {
      console.log("Done1");
      this.endOfLearn();
    } else {
      this.next();
    }
  }

  fail() {
    this.next();
  }

  endOfLearn() {
    console.log("Done2");
    let chit = document.querySelector(".fiszka");
    chit.innerHTML = `Done!`;
  }

  display() {
    console.log(this.cards);
    let chit = document.querySelector(".fiszka");
    chit.innerHTML = ``;
    let actualCard = this.cards[this.idOfCard];
    let card = new Card(
      actualCard.id,
      actualCard.word,
      actualCard.translate,
      actualCard.sentence,
      actualCard.translate_sentence
    );
    card.show(this.isFront);
    const knowButton = document.querySelector(".know-button");
    const unknowButton = document.querySelector(".unknow-button");
    knowButton.addEventListener("click", this.pass.bind(this));
    unknowButton.addEventListener("click", this.fail.bind(this));
    if (this.isFront) {
      const getTranslateButton = document.querySelector(
        "#get-translate-button"
      );
      getTranslateButton.addEventListener("click", () => {
        this.isFront = false;
        this.display();
      });
    } else {
      const getWordButton = document.querySelector("#get-word-button");
      getWordButton.addEventListener("click", () => {
        this.isFront = true;
        this.display();
      });
    }
  }

  getXY(e) {
    this.x = e.changedTouches[0].pageX;
    this.y = e.changedTouches[0].pageY;
  }

  change(e) {
    let currentX = e.changedTouches[0].pageX - this.x;
    let currentY = e.changedTouches[0].pageY - this.y;

    if (Math.abs(currentX) > Math.abs(currentY)) {
      if (currentX < 0) {
        this.next();
      } else {
        this.prev();
      }
    } else {
      if (currentY < 0) {
        this.isFront = false;
        this.display();
      } else {
        this.isFront = true;
        this.display();
      }
    }
  }

  next() {
    do {
      this.idOfCard = (this.idOfCard + 1) % this.quantityOfCards;
      this.quantityOfSlice++;
    } while (this.cards[this.idOfCard].quantityOfRepeats !== -1);
    this.quantityOfLoops = this.quantityOfSlice % this.quantityOfCards;
    this.isFront = false;
    this.display();
  }

  prev() {
    do {
      this.idOfCard =
        (this.idOfCard + this.quantityOfCards - 1) % this.quantityOfCards;
    } while (this.cards[this.idOfCard].quantityOfRepeats !== -1);
    this.display();
  }
}

getAllFiches(idBunch).then(response => {
  let colection = new Colection(1, response);
  colection.display();
});

let someElement = document.querySelector(".fiszka");
// let process_touchstart = () => console.log("start");
let process_touchmove = () => console.log("move");
let process_touchcancel = () => console.log("cancel");
// let process_touchend = () => console.log("end");
someElement.addEventListener(
  "touchstart",
  e => {
    colection.getXY(e);
  },
  false
);
someElement.addEventListener("touchmove", process_touchmove, false);
someElement.addEventListener("touchcancel", process_touchcancel, false);
someElement.addEventListener(
  "touchend",
  e => {
    colection.change(e);
  },
  false
);
