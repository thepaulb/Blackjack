import Hand from "./Hand.js";
import Bank from "./Bank.js";
import PlayerView from "./PlayerView.js";
import DealerView from "./DealerView.js";

export default class Player {
  #name;
  #game;
  #hand;
  #bank;

  constructor(name, game, view = new PlayerView(name, game, this)) {
    this.#name = name;
    this.#game = game;
    this.view = view;

    this.#hand = new Hand(this.view.element);

    if (!this.isDealer()) {
      this.#bank = new Bank(this.view.element.querySelector(".wager"));
    }
  }

  // ----------------------
  // 🧠 Game Logic
  // ----------------------

  updateHand(cards) {
    this.view.updateCards(cards, (card, container) =>
      this.#hand.addCard(card, container)
    );

    const total = this.#game.checkHand(this.#hand.cards);
    this.view.updateStatus(total);

    if (["bust", "blackjack"].includes(total.status)) {
      setTimeout(() => this.#game.transition("activateplayer"), 1000);
    }
  }

  reset() {
    this.view.remove();
    this.view = this.isDealer()
      ? new DealerView(this.#name, this.#game)
      : new PlayerView(this.#name, this.#game, this);

    this.#hand = new Hand(this.view.element);

    if (!this.isDealer()) {
      this.#bank.reset(this.view.element.querySelector(".wager"));
    }
  }

  isDealer() {
    return this.#name === "Dealer";
  }

  // ----------------------
  // 📣 Player Actions
  // ----------------------

  placeBet() {
    this.#bank?.deactivate();
  }

  updateBank(...args) {
    this.#bank?.updateBank(...args);
  }

  activate() {
    this.view.show();
  }

  deactivate() {
    this.view.hide();
  }

  // ----------------------
  // ✅ Accessors
  // ----------------------

  get hand() {
    return this.#hand;
  }

  get element() {
    return this.view.element;
  }

  get name() {
    return this.#name;
  }
}
