import Hand from "./Hand.js";
import Bank from "./Bank.js";

export class Player {
  constructor(name, game) {
    // Internal ref;
    this.id = name.replaceAll(" ", "").toLowerCase();
    this.name = name;
    this.game = game;
    this.elem = this.init();
  }

  init() {
    this.createElement();
    this.hand = new Hand(this.elem);
    this.render();
    // Hmmm … bad coupling :/
    if (this.name != "Dealer") {
      this.bank = new Bank(this.elem.querySelector(".wager"));
    }
    return this.elem;
  }

  createElement() {
    // this method is used to allow the Dealer
    // class to reuse the render method;
    this.elem = document.createElement("section");
    this.elem.setAttribute("id", this.id);
    this.elem.setAttribute("class", "player");
    const parent = document.querySelector("#players");
    parent.append(this.elem);
    this.elem.addEventListener("click", this);
    return this.elem;
  }

  render() {
    const tmpl = document.querySelector("#player__tmpl");
    const clone = tmpl.content.cloneNode(true);
    clone.querySelector(".player__hd").id = `${this.id}__hd`;
    clone.querySelector(".player__bd").id = `${this.id}__bd`;
    clone.querySelector("h3").prepend(`${this.name}`);
    clone.querySelectorAll("button").forEach((el, i) => r.call(this, el, i));
    this.elem.append(clone);
    return this.elem;

    //sets the data attrs based on player id;
    function r(el, i) {
      i > 0 ? (el.dataset.stand = this.id) : (el.dataset.hit = this.id);
    }
  }

  reset() {
    delete this.hand;
    document.getElementById(`${this.id}`).remove();
    this.init();
  }

  handleEvent(event) {
    if (event.target.closest("[data-hit]")) {
      this.game.transition("playerhit", { player: this });
    } else if (event.target.closest("[data-stand]")) {
      this.game.transition("activateplayer");
    }
  }

  updateHand(cards) {
    // This is the yellow card outline, for display only;
    const marker = this.elem.querySelector(".marker");
    if (marker) {
      marker.remove();
    }

    // Update hand, both internally and on screen;
    const el = this.elem.querySelector(".cards");
    cards.forEach((card) => this.hand.addCard(card, el));

    // Update on-screen status;
    const total = this.game.checkHand(this.hand.cards);
    this.updateStatus(total);

    if (total.status == "bust" || total.status == "blackjack") {
      // Pause to allow user to 'get it' before moving on to next player;
      setTimeout(() => {
        this.game.transition("activateplayer");
      }, 1000);
    }
  }

  updateStatus(total) {
    const status = this.elem.querySelector("h3 .status");
    status.innerHTML = "";
    status.classList.remove("visually-hidden");
    status.append(total.status);
  }

  activate() {
    this.elem.classList.replace("inactive", "active");
    // This check is here because the Dealer doesn't have a footer;
    const footer = this.elem.querySelector(".player__ft");
    // Dealer doesn't have a footer;
    if (footer) {
      this.elem
        .querySelector(".player__ft")
        .classList.remove("visually-hidden");
    }
  }

  deactivate() {
    if (this.elem.classList.contains("active")) {
      this.elem.classList.replace("active", "inactive");
    } else {
      this.elem.classList.add("inactive");
    }
    // This check is here because the Dealer doesn't have a footer;
    const footer = this.elem.querySelector(".player__ft");
    // Dealer doesn't have a footer;
    if (footer) {
      footer.classList.add("visually-hidden");
    }
  }

  placeBet() {
    // Dealer doesn't have a bank, obvs.
    // Hhmmm … this is getting a bit messy
    // Player shouldn't be aware of the concept of Dealer
    if (this.bank) {
      this.bank.deactivate();
    }
  }

  updateBank(status) {
    this.bank.updateBank(...arguments);
  }
}

export class Dealer extends Player {
  constructor() {
    super(...arguments);
  }

  render() {
    super.render();
    // Dealer doesn't need the following …
    this.elem.querySelector(".wager, .player__ft").remove();
  }

  activate() {
    super.activate();
    this.elem.querySelectorAll(".card")[1].classList.remove("face-down");
  }

  updateHand(cards) {
    super.updateHand(...arguments);
    if (this.hand.cards.length == 2) {
      console.log("Dealer::updateHand(), hide card 2");
      this.elem.querySelectorAll(".card")[1].classList.add("face-down");
      this.elem.querySelector("h3 .status").classList.add("visually-hidden");
    } else {
      console.log("Dealer::updateHand(), show card 2");
      this.elem.querySelectorAll(".card")[1].classList.remove("face-down");
      this.elem.querySelector("h3 .status").classList.remove("visually-hidden");
    }
  }
}
