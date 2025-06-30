import Player from "./Player.js";

export default class Dealer extends Player {
  onRenderComplete() {
    this.elem.querySelector(".wager")?.remove();
    this.elem.querySelector(".player__ft")?.remove();
  }

  activate() {
    super.activate();
    this.#revealSecondCard();
  }

  updateHand(cards) {
    super.updateHand(cards);

    const secondCard = this.elem.querySelectorAll(".card")[1];
    const statusElem = this.elem.querySelector("h3 .status");

    if (!secondCard || !statusElem) return;

    if (this.cards.length === 2) {
      this.#hideSecondCard(secondCard, statusElem);
    } else {
      this.#revealSecondCard(secondCard, statusElem);
    }
  }

  #hideSecondCard(card, status) {
    card.classList.add("face-down");
    status.classList.add("visually-hidden");
  }

  #revealSecondCard() {
    const secondCard = this.elem.querySelectorAll(".card")[1];
    const statusElem = this.elem.querySelector("h3 .status");

    if (secondCard && statusElem) {
      secondCard.classList.remove("face-down");
      statusElem.classList.remove("visually-hidden");
    }
  }
}
