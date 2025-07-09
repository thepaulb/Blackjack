export default class PlayerView {
  #id;
  #name;
  #element;
  #parent;
  #game;

  constructor(name, game, parent) {
    this.#name = name;
    this.#game = game;
    this.#parent = parent;
    this.#id = this.#generateId(name);
    this.#element = this.#createElement();
    this.render(this.#element);
  }

  // ------------------
  // 🧩 Initialisation
  // ------------------

  #generateId = (name) => name.replaceAll(" ", "").toLowerCase();

  #createElement() {
    const section = document.createElement("section");
    section.id = this.#id;
    section.className = "player";

    document.querySelector("#players")?.append(section);
    section.addEventListener("click", this);

    return section;
  }

  render(container) {
    const tmpl = document.querySelector("#player__tmpl");
    const clone = tmpl.content.cloneNode(true);

    clone.querySelector(".player__hd").id = `${this.#id}__hd`;
    clone.querySelector(".player__bd").id = `${this.#id}__bd`;
    clone.querySelector("h3")?.prepend(this.#name);

    clone.querySelectorAll("button").forEach((btn, i) => {
      btn.dataset[i > 0 ? "stand" : "hit"] = this.#id;
    });

    container.append(clone);
    this.onRenderComplete();
  }

  // ------------------
  // 🧠 Public API
  // ------------------

  onRenderComplete() {
    // Subclasses can override this
  }

  get element() {
    return this.#element;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  remove() {
    this.#element.remove();
  }

  getStatusElement() {
    return this.#element.querySelector("h3 .status");
  }

  hideStatus() {
    this.getStatusElement()?.classList.add("visually-hidden");
  }

  updateStatus(status) {
    const elem = this.getStatusElement();
    if (!elem) return;

    elem.textContent = status.status;
    elem.classList.remove("visually-hidden");
  }

  show() {
    this.#element.classList.remove("inactive");
    this.#element.classList.add("active");
    this.#element
      .querySelector(".player__ft")
      ?.classList.remove("visually-hidden");
  }

  hide() {
    this.#element.classList.remove("active");
    this.#element.classList.add("inactive");
    this.#element
      .querySelector(".player__ft")
      ?.classList.add("visually-hidden");
  }

  updateCards(cards, cardRenderer) {
    const container = this.#element.querySelector(".cards");
    this.#element.querySelector(".marker")?.remove();
    cards.forEach((card) => cardRenderer(card, container));
  }

  // ------------------
  // ⚡ Event Handling
  // ------------------

  // ✅ Public — used as event listener
  handleEvent(e) {
    const { target } = e;
    if (target.closest("[data-hit]")) {
      this.#game.transition("playerhit", { player: this.#parent });
    } else if (target.closest("[data-stand]")) {
      this.#game.transition("activateplayer");
    }
  }
}
