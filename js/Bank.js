export default class Bank {
  // Private fields
  #bank = 20;
  #id = null;
  #stake = 0;
  #element = null;
  #warningEl = null;

  constructor(element, parent) {
    this.#element = element;
    this.#warningEl = this.#element.querySelector(".warning");
    this.#id = this.#generateId(parent);
    this.#loadBankFromStorage();
    this.#bindEvents();
    this.#renderChips();
  }

  #generateId(parent) {
    return `blackjack_${parent.replaceAll(" ", "").toLowerCase()}_bank`;
  }

  // -------------------------
  // 🔹 Public API
  // -------------------------

  reset(element) {
    this.#element = element;
    this.#warningEl = this.#element.querySelector(".warning");
    this.#stake = 0;
    this.#saveBankToStorage();
    this.#bindEvents();
    this.#renderChips();
  }

  updateBank(status) {
    switch (status) {
      case "blackjack":
        this.#bank += this.#stake * 2;
        this.#bank += this.#stake;
        break;
      case "push":
        this.#bank += this.#stake;
        break;
      case "win":
        this.#bank += this.#stake * 2;
        break;
      case "lose":
        this.#bank -= this.#stake;
      default:
        break;
    }

    this.#stake = 0;
    this.#saveBankToStorage();
    this.#renderChips(true); // animate win/loss
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
    const value = parseInt(input.value, 10);
    console.log("Stake change event:", value);

    if (isNaN(value) || value > this.#bank || value < 0) {
      this.#showWarning("Stake exceeds available chips");
      return;
    }

    this.#stake = value;
    this.#hideWarning();
    this.#renderChips(true); // animate stake change
  }

  // -------------------------
  // 🔸 DOM Manipulation
  // -------------------------

  #renderChips(animate = false) {
    const stakeChip = this.#element.querySelector(".stake .chip");
    const bankChip = this.#element.querySelector(".bank .chip");

    if (!stakeChip || !bankChip) return;

    if (animate) {
      stakeChip.classList.add("chip-animate");
      bankChip.classList.add("chip-animate");

      setTimeout(() => {
        stakeChip.classList.remove("chip-animate");
        bankChip.classList.remove("chip-animate");
      }, 400); // match CSS animation time
    }

    stakeChip.textContent = this.#stake;
    bankChip.textContent = this.#bank - this.#stake;
  }

  #toggleVisibility(showBankInputs) {
    this.#element
      .querySelector(".bank")
      ?.classList.toggle("visually-hidden", !showBankInputs);
    this.#element
      .querySelector(".set-stake")
      ?.classList.toggle("visually-hidden", !showBankInputs);
    this.#element
      .querySelector(".stake")
      ?.classList.toggle("visually-hidden", showBankInputs);
  }

  #showWarning(msg) {
    if (!this.#warningEl) return;
    this.#warningEl.textContent = msg;
    this.#warningEl.classList.remove("visually-hidden");
  }

  #hideWarning() {
    if (!this.#warningEl) return;
    this.#warningEl.classList.add("visually-hidden");
  }

  // -------------------------
  // 🔸 Persistence
  // -------------------------

  #saveBankToStorage() {
    localStorage.setItem(this.#id, String(this.#bank));
  }

  #loadBankFromStorage() {
    const stored = parseInt(localStorage.getItem(this.#id), 10);
    if (!isNaN(stored)) {
      this.#bank = stored;
    }
  }
}
