import deck from "./Deck.js";
import Player from "./Player.js";
import Dealer from "./Dealer.js";

// Finite states
const states = {
  START: "start",
  DEAL: "deal",
  PLAY: "play",
  DEALER_TURN: "dealerTurn",
  GAME_OVER: "gameOver",
};

class Blackjack {
  constructor() {
    this.deck = deck();
    this.state = states.START;
    this.players = [];
    this.currentPlayer = 0;
  }

  // 🔁 Finite State Transition Handler
  async transition(event, props = {}) {
    switch (this.state) {
      case states.START:
        this.#handleStartState(event);
        break;

      case states.DEAL:
        this.#handleDealState(event);
        break;

      case states.PLAY:
        this.#handlePlayState(event, props);
        break;

      case states.DEALER_TURN:
        await this.#handleDealerTurn();
        break;

      case states.GAME_OVER:
        if (event === "gameover") await this.#checkWinners();
        break;

      default:
        throw new Error("Invalid state transition");
    }

    console.log(`Transitioned to state: ${this.state}`);
  }

  // ✅ Start State: Add players, reset, deal
  #handleStartState(event) {
    if (event === "init") {
      if (this.players.length === 0) this.addPlayer(); // Add Dealer only once
    }

    if (event === "addplayer") {
      this.addPlayer();
    }

    if (event === "newgame") {
      this.currentPlayer = 0;
      [...this.players].reverse().forEach((p) => p.reset()); // reset dealer last
    }

    if (event === "deal") {
      this.state = states.DEAL;
      this.transition("deal");
    }
  }

  // ✅ Deal State: Bets & first deal
  #handleDealState(event) {
    if (event === "addplayer") {
      console.log("Cannot add players while game is in play!");
      return;
    }

    if (event === "deal") {
      this.state = states.PLAY;
      this.players.forEach((player) => player.placeBet());
      this.players.forEach((player) => this.dealCards(player, 2));
      this.transition("activateplayer");
    }
  }

  // ✅ Play State: Activate players, handle hits
  #handlePlayState(event, { player }) {
    if (event === "activateplayer") {
      this.#setActivePlayer();
    }

    if (event === "playerhit") {
      this.dealCards(player, 1);
    }
  }

  #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ✅ Dealer turn logic: hits until 17+, then checks winners
  async #handleDealerTurn() {
    const dealer = this.players[this.currentPlayer];
    let total = this.checkHand(dealer.hand.cards);

    // Delay and draw until dealer reaches 17 or higher
    while (typeof total.status === "number" && total.status < 17) {
      await this.#delay(1500); // pause before each draw
      dealer.updateHand(this.deck.deal(1));
      total = this.checkHand(dealer.hand.cards);
    }

    this.state = states.GAME_OVER;
    this.transition("gameover");
  }

  // 🎯 Determine Winners
  async #checkWinners() {
    await this.#delay(2000); // pause before check
    const dealer = this.players[this.players.length - 1];
    const dealerScore = this.checkHand(dealer.hand.cards);
    const winners = [];

    this.players.slice(0, -1).forEach((player) => {
      const playerScore = this.checkHand(player.hand.cards);

      const playerWins =
        (dealerScore.status === "bust" && playerScore.status !== "bust") ||
        (dealerScore.status !== "blackjack" &&
          typeof dealerScore.status === "number" &&
          playerScore.status >= dealerScore.status) ||
        playerScore.status === "blackjack";

      if (playerWins) {
        winners.push(player.name);

        if (playerScore.status === "blackjack") {
          player.updateBank("blackjack");
        } else if (playerScore.status === dealerScore.status) {
          player.updateBank("push");
        } else {
          player.updateBank("win");
        }
      } else {
        player.updateBank("lose");
      }
    });

    if (winners.length === 0) {
      winners.push("House wins!");
    }

    this.#showWinners(winners.join(", "));
  }

  // 💬 Show winners dialog
  #showWinners(winners) {
    const dialog = document.getElementById("winners__dialog");
    dialog.querySelector("p").textContent = winners;
    dialog.showModal();
  }

  // 🎯 Activates the current player, or starts Dealer turn
  #setActivePlayer() {
    this.players.forEach((player) => player.deactivate());

    if (this.currentPlayer === this.players.length - 1) {
      this.state = states.DEALER_TURN;
      this.transition();
      return;
    }

    this.players[this.currentPlayer++].activate();
  }

  // 🔃 Deal cards to player
  dealCards(player, count = 1) {
    if ([states.DEAL, states.PLAY].includes(this.state)) {
      const cards = this.deck.deal(count);
      player.updateHand(cards);
    } else {
      console.warn("Cards cannot be dealt from current state");
    }
  }

  // ➕ Add player (Dealer added first)
  addPlayer() {
    if (this.state !== states.START) {
      console.warn("Players cannot be added at this stage.");
      return;
    }

    if (this.players.length === 0) {
      this.players.push(new Dealer("Dealer", this));
    } else {
      this.players.unshift(new Player(`Player ${this.players.length}`, this));
    }
  }

  // 🎲 Game lifecycle API
  startGame() {
    if (this.state === states.START) {
      this.transition("init");
    } else {
      console.warn("Game cannot start from current state");
    }
  }

  newGame() {
    this.state = states.START;
    this.transition("newgame");
  }

  // 🧮 Card Value Logic
  getCardValue(card) {
    const rank = card.slice(1);
    if (["K", "Q", "J", "10"].includes(rank)) return 10;
    if (rank === "A") return 11;
    return parseInt(rank);
  }

  checkHand(cards) {
    let value = 0;
    let aces = 0;

    for (const card of cards) {
      const rank = card.slice(1);
      if (rank === "A") {
        value += 11;
        aces++;
      } else {
        value += this.getCardValue(card);
      }
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    let status;
    if (value > 21) status = "bust";
    else if (value === 21 && cards.length === 2) status = "blackjack";
    else status = value;

    return { value, status };
  }
}

// 🔁 Singleton export
const bjx = new Blackjack();

export default function blackjack() {
  return bjx;
}
