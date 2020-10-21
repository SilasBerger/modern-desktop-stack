customElements.define("person-card", class extends HTMLElement {

  constructor() {
    super();
    
    // Attach a shadow DOM to this element.
    this.shadow = this.attachShadow({ mode: "open" });

    // Fetch the template and its content form the light DOM.
    const template = document.getElementById("person-card-template");
    const templateContent = template.content;

    // Attach a deep clone of the template content to the shadow DOM (true arg 
    // sets clone type to deep).
    this.shadow.appendChild(templateContent.cloneNode(true));

    // Fill in the blanks with data from attributes.
    this.setValues();

    // Add a click handler for the change button, which updates this element's attributes.
    this.shadow.querySelector("#btn-change-person").onclick = () => {
      console.log("Button pressed");
      this.setAttribute("person-name", "Ron Swanson");
      this.setAttribute("person-email", "ron.swanson@pawnee.gov");
      this.setAttribute("person-age", 55);
    };
  }

  setValues() {
    console.log("set values called");
    this.shadow.querySelector("#name").innerHTML = `${this.getAttribute("person-name")}`;
    this.shadow.querySelector("#age").innerHTML = `Age: ${this.getAttribute("person-age")}`;
    this.shadow.querySelector("#email").innerHTML = `Email: ${this.getAttribute("person-email")}`;
  }

  // Declare which attributes to observe for changes. The browser
  // will call this function.
  static get observedAttributes() {
    return ["person-name", "person-age", "person-email"];
  }

  // Invoked when one of the observed attributes changed. The attribute change can be
  // manually caused by clicking the "Change to Ron Swanson" button.
  attributeChangedCallback(attrName, oldValue) {
    console.log("Attribute has changed");
    this.setValues();
  }
});