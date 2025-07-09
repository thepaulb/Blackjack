/*
Gameplay:
√ - Initial Deal: Each player receives two cards, face up. The dealer receives one card face up (the “upcard”) and one card face down (the “hole card”).
√ - Player Turn: Based on their hand value, players can choose to:
		Hit: Take an additional card from the deck to try to get closer to 21 or beat the dealer’s hand.
		Stand: Keep their current hand and end their turn.
Double Down: Double their initial bet and receive one more card, then stand.
Split: If the initial two cards have the same value, split them into two separate hands, each with a separate bet.
Dealer Turn: After all players have finished their turns, the dealer reveals their hole card and follows a set of predetermined rules:
If the dealer’s hand value is 16 or less, they must draw another card.
If the dealer’s hand value is 17 or more, they must stand.

Winning and Losing:
If a player’s hand value exceeds 21, they “bust” and lose their bet.
If the dealer busts, all remaining players win.
If a player’s hand value is higher than the dealer’s, they win even money (1:1) on their bet.
If a player’s hand value is the same as the dealer’s, the result is a “push,” and the player’s bet is returned.

Special Rules:
Insurance: If the dealer’s upcard is an Ace, players can take “insurance” by betting half their initial bet. If the dealer has a Blackjack (Ace and 10-value card), insurance pays 2:1.
Blackjack: If a player’s initial two cards are an Ace and a 10-value card, they have a “Blackjack” and win immediately, unless the dealer also has a Blackjack.
*/
import blackjack from "./Blackjack.js";

window.addEventListener("DOMContentLoaded", async () => {
  const elem = document.querySelector("#actions_buttons");
  const game = blackjack();
  game.startGame();

  elem.addEventListener("click", (e) => {
    const { target } = e;
    switch (target.dataset.action) {
      case "deal":
        game.transition("deal");
        break;
      case "addplayer":
        game.transition("addplayer");
        break;
      case "newgame":
        game.newGame();
        break;
    }
  });
});
