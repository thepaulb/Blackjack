import deck from "./Deck.js";

export default class Hand {
  constructor(el) {
    this.elem = el;
    this.cards = [];
    this.deck = deck();
  }

  addCard(card, el) {
    this.cards.push(card);
    this.render(...arguments);
  }

  render(card, parent) {
    var el = this.deck.getCardHtml(...arguments);
    parent.append(el);
  }
}
