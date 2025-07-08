import PlayerView from "./PlayerView.js";

export default class DealerView extends PlayerView {
  constructor(name) {
    super(...arguments);
  }

  onRenderComplete() {
    // Remove the elements specific to regular players
    this.element.querySelector(".wager")?.remove();
    this.element.querySelector(".player__ft")?.remove();
  }

  hideSecondCard() {
    const cards = this.element.querySelectorAll(".card");
    if (cards[1]) {
      cards[1].classList.add("face-down");
    }

    const status = this.getStatusElement();
    status?.classList.add("visually-hidden");
  }

  showSecondCard() {
    const cards = this.element.querySelectorAll(".card");
    if (cards[1]) {
      cards[1].classList.remove("face-down");
    }

    const status = this.getStatusElement();
    status?.classList.remove("visually-hidden");
  }
}
