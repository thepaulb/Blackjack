class Deck {
  constructor() {
    this.deck = this.create();
  }

  getCardHtml(card, el) {
    let suit = card.slice(0, 1);
    let rank = card.slice(1);
    let icon = null;
    let col = "black";

    // set icons for cards;
    switch (suit) {
      case "H":
        icon = "&hearts;";
        col = "red";
        break;

      case "D":
        icon = "&diams;";
        col = "red";
        break;

      case "C":
        icon = "&clubs;";
        break;

      case "S":
        icon = "&spades;";
        break;
    }

    const tmpl = document.querySelector("#card__tmpl");
    const clone = tmpl.content.cloneNode(true);
    clone.querySelector(".card").classList.add(col);
    clone.querySelector(".face").innerHTML = `${rank}<br />${icon}`;
    el.append(clone);
  }

  create() {
    let deck = [];
    let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    let suits = ["H", "D", "C", "S"];

    // create 52 card deck;
    for (let i = 0; i < ranks.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        deck.push(suits[j] + ranks[i]);
      }
    }
    // TEST CASES
    //––––––––––––––––––
    // return ["HA", "SK", "D2", "SJ", "S6", ...this.shuffle(deck)]; // Blackjack
    // return ['HA', 'SK', 'D2', 'S3', 'H5', 'SQ', ...this.shuffle(deck)]; //dealer hit
    // return ["HA", "SA", "D2", "SJ", "SA", ...this.shuffle(deck)]; // wild aces;
    // return ["H9", "SK", "D8", "SJ", "SA", ...this.shuffle(deck)]; // Player 1 wins!

    return this.shuffle(deck);
  }

  deal(num) {
    let cards = [];

    // TODO: need to check number of cards left in the deck;
    for (let i = 0; i < num; i++) {
      cards.push(this.deck.shift());
    }

    return cards;
  }

  shuffle(deck) {
    let currentIndex = deck.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex],
        deck[currentIndex],
      ];
    }

    return deck;
  }
}

const d = new Deck();

// I guess a simple factory?
export default function deck() {
  return d;
}
