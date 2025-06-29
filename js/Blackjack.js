import deck from "./Deck.js";
import { Player, Dealer } from "./Player.js";

// Define the possible states
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

  transition(event, props) {
    switch (this.state) {
      case states.START:
        if (event == "init") {
          console.log("Set up inital game events");
          console.log(event + ": Add new player Dealer");
          // this is a restart;
          if (this.players.length == 0) {
            //Add Dealer here;
            this.addPlayer();
          }
        }
        if (event == "addplayer") {
          this.addPlayer();
        }
        if (event == "newgame") {
          this.currentPlayer = 0;
          // reset players in reverse to ensure dealer first;
          for (let i = this.players.length - 1; i >= 0; i--) {
            this.players[i].reset();
          }
        }
        if (event == "deal") {
          this.state = states.DEAL;
          this.transition("deal");
        }
        break;

      case states.DEAL:
        if (event == "addplayer") {
          console.log("Players can't be added game in play!");
        }
        if (event == "deal") {
          this.state = states.PLAY;
          // set bet first …
          this.players.forEach((player) => player.placeBet());
          // … then deal cards;
          this.players.forEach((player) => this.dealCards(player, 2));
          this.transition("activateplayer");
        }
        break;

      case states.PLAY:
        if (event == "activateplayer") {
          this.setActivePlayer();
        }
        if (event == "playerhit") {
          this.dealCards(props.player, 1);
        }
        break;

      case states.DEALER_TURN:
        const dealer = this.players[this.currentPlayer];
        let total = this.checkHand(dealer.hand.cards);
        while (total.status < 17) {
          dealer.updateHand(this.deck.deal(1));
          total = this.checkHand(dealer.hand.cards);
        }

        this.state = states.GAME_OVER;
        this.transition("gameover");
        break;

      case states.GAME_OVER:
        if (event == "gameover") {
          this.checkWinners();
        }
        break;

      default:
        throw new Error("Invalid state transition");
    }
    console.log(`Transitioned to state: ${this.state}`);
  }

  checkWinners() {
    const dealer = this.players[this.players.length - 1];
    const dealerScore = this.checkHand(dealer.hand.cards);
    const winners = [];
    // The reason for the slice() is last player in the
    // array is always the Dealer;
    this.players.slice(0, this.players.length - 1).forEach((player) => {
      let playerScore = this.checkHand(player.hand.cards);
      // Everything but these senario's result in a player win;
      if (
        (dealerScore.status == "bust" && playerScore.status != "bust") ||
        (dealerScore.status != "blackjack" &&
          dealerScore.status <= playerScore.status) ||
        playerScore.status == "blackjack"
      ) {
        // winner logic;
        winners.push(player.name);
        if (playerScore.status == "blackjack") {
          player.updateBank("blackjack");
        } else if (playerScore.status == dealerScore.status) {
          player.updateBank("push");
        } else {
          player.updateBank("win");
        }
      } else {
        player.updateBank("lose");
      }
    });
    if (winners.length == 0) {
      winners.push("House wins!");
    }
    this.showWinners(winners.join(", "));
  }

  showWinners(winners) {
    const dialog = document.getElementById("winners__dialog");
    const para = dialog.querySelector("p");
    para.innerHTML = "";
    para.append(winners);
    dialog.showModal();
  }

  setActivePlayer() {
    // Deactivate all players first;
    this.players.forEach((player) => player.deactivate());
    if (this.currentPlayer == this.players.length - 1) {
      this.state = states.DEALER_TURN;
      this.transition("activateplayer");
    }
    this.players[this.currentPlayer++].activate();
  }

  startGame() {
    if (this.state === states.START) {
      this.transition("init");
    } else {
      console.log("Game cannot start from current state");
    }
  }

  newGame() {
    this.state = states.START;
    this.transition("newgame");
  }

  addPlayer() {
    if (this.state === states.START) {
      // add player to the front of the array, ensuring Dealer always last;
      if (this.players.length == 0) {
        this.players.push(new Dealer("Dealer", this));
      } else {
        this.players.unshift(new Player(`Player ${this.players.length}`, this));
        var x = 0;
      }
      //console.log(this.players);
    } else {
      console.log("Players cannot be added from current state");
    }
  }

  dealCards(player, num) {
    if (this.state === states.DEAL || this.state === states.PLAY) {
      console.log("Dealing cards to player and dealer...");
      player.updateHand(this.deck.deal(num));
    } else {
      console.log("Cards cannot be dealt from current state");
    }
  }

  getCardValue(card) {
    const rank = card.slice(1); // Removes suit
    if (["K", "Q", "J", "10"].includes(rank)) return 10;
    // TODO: this seems redundant?
    if (rank === "A") return 11; // Initially count Ace as 11
    return parseInt(rank);
  }

  checkHand(cards) {
    let value = 0;
    let aces = 0;
    let status;

    cards.forEach((card) => {
      let rank = card.slice(1);
      if (rank === "A") {
        aces++;
        value += 11;
      } else {
        value += this.getCardValue(card);
      }
    });

    // Adjust for Aces if total is over 21
    while (value > 21 && aces > 0) {
      value -= 10; // Convert one Ace from 11 to 1
      aces--;
    }

    if (value > 21) {
      status = "bust";
    } else if (value == 21 && cards.length == 2) {
      status = "blackjack";
    } else {
      status = value;
    }

    return { value: value, status: status };
  }
}

const bj = new Blackjack();

export default function blackjack() {
  return bj;
}
