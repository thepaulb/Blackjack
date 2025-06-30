export default class PlayerUI {
  #elem;
  #id;
  name;

  constructor(name) {
    this.name = name;
    this.#id = this.#generateId(name);
    this.#elem = this.#initElement();
    this.render();
  }

  #generateId(name) {
    return name.replaceAll(" ", "").toLowerCase();
  }

  get id() {
    return this.#id;
  }

  get elem() {
    return this.#elem;
  }

  #initElement() {
    const elem = document.createElement("section");
    elem.id = this.#id;
    elem.className = "player";

    document.querySelector("#players").append(elem);
    // expect `handleEvent()` in subclass
    elem.addEventListener("click", this);

    return elem;
  }

  render() {
    const tmpl = document.querySelector("#player__tmpl");
    const clone = tmpl.content.cloneNode(true);

    clone.querySelector(".player__hd").id = `${this.#id}__hd`;
    clone.querySelector(".player__bd").id = `${this.#id}__bd`;
    clone.querySelector("h3").prepend(this.name);

    clone.querySelectorAll("button").forEach((el, i) => {
      if (i === 0) {
        el.dataset.hit = this.#id;
      } else {
        el.dataset.stand = this.#id;
      }
    });

    this.#elem.append(clone);
    this.onRenderComplete();
  }

  onRenderComplete() {
    // Subclasses can override this to tweak the DOM post-render
  }

  updateStatus(text) {
    const status = this.#elem.querySelector("h3 .status");
    if (status) {
      status.textContent = text;
      status.classList.remove("visually-hidden");
    }
  }

  showFooter() {
    this.#elem
      .querySelector(".player__ft")
      ?.classList.remove("visually-hidden");
  }

  hideFooter() {
    this.#elem.querySelector(".player__ft")?.classList.add("visually-hidden");
  }

  activate() {
    this.#elem.classList.replace("inactive", "active");
    this.showFooter();
  }

  deactivate() {
    this.#elem.classList.remove("active");
    this.#elem.classList.add("inactive");
    this.hideFooter();
  }

  destroy() {
    this.#elem.remove();
  }

  resetElement() {
    this.destroy();
    this.#elem = this.#initElement();
    this.render();
  }
}
