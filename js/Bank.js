export default class Bank {
  // Private state
  #bank = 20;
  #stake = 0;
  #element = null;

  constructor(element) {
    this.#element = element;
    this.#bindEvents();
    this.#renderInitialBank();
  }

  // -------------------------
  // 🔹 Public API
  // -------------------------

  reset(element) {
    this.#element = element;
    this.#bank = 20;
    this.#stake = 0;
    this.#bindEvents();
    this.#renderInitialBank();
  }

  updateBank(status) {
    switch (status) {
      case "blackjack":
        this.#bank += this.#stake * 2; // Blackjack pays 3x (1 already removed on stake)
        this.#bank += this.#stake;
        break;
      case "push":
        this.#bank += this.#stake; // Stake returned
        break;
      case "win":
        this.#bank += this.#stake * 2; // Win pays 2x
        break;
      case "lose":
      default:
        // Stake already subtracted
        break;
    }

    this.#stake = 0;
  }

  activate() {
    this.#toggleVisibility(true);
  }

  deactivate() {
    this.#toggleVisibility(false);
  }

  // -------------------------
  // 🔸 DOM Event Handling
  // -------------------------

  #bindEvents() {
    this.#element.removeEventListener("change", this);
    this.#element.addEventListener("change", this);
  }

  handleEvent(e) {
    if (e.type === "change") {
      this.#handleStakeChange(e);
    }
  }

  #handleStakeChange(e) {
    const input = e.target;
    const newStake = parseInt(input.value, 10);

    if (isNaN(newStake) || newStake > this.#bank) {
      return;
    }

    this.#stake = newStake;
    this.#renderChips();
  }

  // -------------------------
  // 🔸 DOM Manipulation
  // -------------------------

  #renderChips() {
    const stakeChip = this.#element.querySelector(".stake .chip");
    const bankChip = this.#element.querySelector(".bank .chip");

    stakeChip.innerHTML = "";
    bankChip.innerHTML = "";

    stakeChip.append(this.#stake);
    bankChip.append(this.#bank - this.#stake);
  }

  #renderInitialBank() {
    const bankChip = this.#element.querySelector(".bank .chip");
    if (bankChip) {
      bankChip.innerHTML = this.#bank;
    }
  }

  #toggleVisibility(showBankInputs) {
    this.#element
      .querySelector(".bank")
      .classList.toggle("visually-hidden", !showBankInputs);
    this.#element
      .querySelector(".set-stake")
      .classList.toggle("visually-hidden", !showBankInputs);
    this.#element
      .querySelector(".stake")
      .classList.toggle("visually-hidden", showBankInputs);
  }
}
