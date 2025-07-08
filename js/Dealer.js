import Player from "./Player.js";

export default class Dealer extends Player {
  constructor(name, game) {
    super(...arguments);
  }

  updateHand(cards) {
    super.updateHand(cards); // Player logic: add to hand, update status, check if busted

    if (this.hand.cards.length === 2) {
      this.view.hideSecondCard(); // Dealer keeps card face-down at first
    } else {
      this.view.showSecondCard(); // Reveal card + show status on their turn
    }
  }
}
