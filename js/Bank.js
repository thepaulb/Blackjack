export default class Bank {
  constructor(el) {
    this.elem = el;
    this.bank = 20;
    this.stake = 0;
    this.elem.addEventListener("change", this);
  }

  handleEvent(e) {
    if (e.target.value <= this.bank) {
      this.stake = parseInt(e.target.value);
      var temp = this.bank - this.stake;
      var stk = this.elem.querySelector(".stake .chip");
      var bnk = this.elem.querySelector(".bank .chip");
      stk.innerHTML = "";
      bnk.innerHTML = "";
      stk.append(this.stake);
      bnk.append(temp);
    }
  }

  reset(el) {
    // reset this.elem and bind event;
    this.elem = el;
    this.elem.addEventListener("change", this);
    this.elem.querySelector(".bank .chip").innerHTML = this.bank;
  }

  updateBank(status) {
    // assume player loses;
    this.bank = this.bank - this.stake;
    if (status == "blackjack") {
      this.bank = this.bank + this.stake * 3;
    } else if (status == "push") {
      // return stake;
      this.bank = this.bank + this.stake;
    } else if (status == "win") {
      // player wins;
      this.bank = this.bank + this.stake * 2;
    }
    this.stake = 0;
  }

  activate() {
    this.elem.querySelector(".bank").classList.remove("visually-hidden");
    this.elem.querySelector(".set-stake").classList.remove("visually-hidden");
    this.elem.querySelector(".stake").classList.add("visually-hidden");
  }

  deactivate() {
    this.elem.querySelector(".bank").classList.add("visually-hidden");
    this.elem.querySelector(".set-stake").classList.add("visually-hidden");
    this.elem.querySelector(".stake").classList.remove("visually-hidden");
  }
}
