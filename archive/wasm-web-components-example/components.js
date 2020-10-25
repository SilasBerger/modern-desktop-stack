customElements.define("console-line", class extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.appendChild(document.getElementById("template-console-line").content.cloneNode(true));
    this.setText();
  }

  setText() {
    this.shadow.querySelector("div.text").innerHTML = this.getAttribute("line-text");
  }

  static get observedAttributes() {
    return ["line-text"];
  }

  attributeChangedCallback() {
    this.setText();
  }
});

customElements.define("on-screen-console", class extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    this.shadow.appendChild(document.getElementById("template-console").content.cloneNode(true));
    this.container = this.shadow.querySelector("div.container");

    this.addLine("Hello there! I am the console.");
    this.addLine("This is another line, btw...");
  }

  addLine(text) {
    const line = document.createElement("console-line");
    line.setAttribute("line-text", text);
    this.container.appendChild(line);
  }
});