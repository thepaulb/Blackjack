import getDeck from "./Deck.js";

export default class Hand {
  constructor(el) {
    this.elem = el;
    this.cards = [];
    this.deck = getDeck();
  }

  addCard(card, el) {
    this.cards.push(card);
    this.render(...arguments);
  }

  render(card, parent) {
    this.deck.getCardHtml(...arguments);
  }

  checkHand() {
    // console.log("checkHand()", this.cards);
    // return this.getTotal(this.getRanks());
  }

  getRanks() {
    return this.cards.map((card) => {
      // cards in format <suit><rank>;
      let rank = card.slice(1);

      // TODO handle Aces properly;
      if (rank === "A") {
        rank = "A";
      } else if (rank === "J" || rank === "Q" || rank === "K") {
        rank = 10;
      } else {
        rank = Number(rank);
      }
      return rank;
    });
  }

  getTotal() {
    let ret = [];
    let ranks = this.getRanks();
    let aces = ranks.filter((rank) => rank === "A");
    let numbered = ranks.filter((rank) => rank !== "A");
    let total = numbered.reduce((total, rank) => total + rank);

    //ret.push(numbered.reduce((total, rank) => total + rank));

    if (aces.length) {
      aces.forEach((ace, i) => {
        ret.push(total + 1, total + 11);
      });
    } else {
      ret.push(total);
    }
    console.log(aces, ret);

    return [ranks.reduce((total, rank) => total + rank), this.cards];
  }
}

class StatusDisplay {
  constructor(elem) {
    this.elem = elem.querySelector(".status");
    this.deactivate();
  }

  update(message, params) {
    if (params.state === "INITIALISE") return;
    this.elem.innerHTML = message;
    this.activate();
  }

  activate() {
    this.elem.classList.replace("inactive", "active");
  }

  deactivate() {
    if (this.elem.classList.contains("active")) {
      this.elem.classList.replace("active", "inactive");
    } else {
      this.elem.classList.add("inactive");
    }
  }
}
