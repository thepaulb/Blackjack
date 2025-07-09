class Deck {
  // Private fields for encapsulation
  #deck = [];

  constructor() {
    this.#deck = this.#createShuffledDeck();
  }

  // ---------------------------
  // 🔹 Public API
  // ---------------------------

  deal(count = 1) {
    if (this.#deck.length < count) {
      throw new Error(`Not enough cards in deck to deal ${count}.`);
    }

    return this.#deck.splice(0, count);
  }

  getCardHtml(card) {
    const suit = card[0];
    const rank = card.slice(1);
    const icon = this.#getSuitIcon(suit);
    const colourClass = this.#getSuitColour(suit);

    const tmpl = document.querySelector("#card__tmpl");
    const clone = tmpl.content.cloneNode(true);

    const elem = clone.querySelector(".card");
    elem.classList.add(colourClass);
    elem.querySelector(".face").innerHTML = `${rank}<br />${icon}`;

    return clone;
  }

  // ---------------------------
  // 🔸 Internal Logic
  // ---------------------------

  #createShuffledDeck() {
    const suits = ["H", "D", "C", "S"];
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
    const deck = [];

    // create 52 card deck;
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(`${suit}${rank}`);
      }
    }

    return this.#shuffle(deck);
  }

  #shuffle(deck) {
    let currentIndex = deck.length;
    // shuffles an array using the Fisher–Yates algorithm
    while (currentIndex > 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex--);
      [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex],
        deck[currentIndex],
      ];
    }

    return deck;
  }

  // ---------------------------
  // 🔹 DOM Utility Helpers
  // ---------------------------

  #getSuitIcon(suit) {
    const icons = {
      H: "&hearts;",
      D: "&diams;",
      C: "&clubs;",
      S: "&spades;",
    };

    return icons[suit] || "";
  }

  #getSuitColour(suit) {
    return ["H", "D"].includes(suit) ? "red" : "black";
  }
}

const dx = new Deck();

export default function deck() {
  return dx;
}
