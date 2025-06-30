import Hand from "./Hand.js";
import Bank from "./Bank.js";
import PlayerUI from "./PlayerUI.js";

export default class Player extends PlayerUI {
  #hand;
  #bank;
  game;

  constructor(name, game) {
    super(name);
    this.game = game;
    this.#hand = new Hand(this.elem);

    if (name !== "Dealer") {
      this.#bank = new Bank(this.elem.querySelector(".wager"));
    }
  }

  reset() {
    this.#hand = null;
    this.resetElement();
    this.#hand = new Hand(this.elem);

    if (this.#bank) {
      this.#bank.reset(this.elem.querySelector(".wager"));
    }
  }

  handleEvent(event) {
    if (event.target.closest("[data-hit]")) {
      this.game.transition("playerhit", { player: this });
    } else if (event.target.closest("[data-stand]")) {
      this.game.transition("activateplayer");
    }
  }

  updateHand(cards) {
    this.elem.querySelector(".marker")?.remove();
    const el = this.elem.querySelector(".cards");
    cards.forEach((card) => this.#hand.addCard(card, el));

    const total = this.game.checkHand(this.#hand.cards);
    this.updateStatus(total.status);

    if (["bust", "blackjack"].includes(total.status)) {
      setTimeout(() => this.game.transition("activateplayer"), 1000);
    }
  }

  placeBet() {
    this.#bank?.deactivate();
  }

  updateBank(...args) {
    this.#bank?.updateBank(...args);
  }

  get cards() {
    return this.#hand?.cards ?? [];
  }
}
