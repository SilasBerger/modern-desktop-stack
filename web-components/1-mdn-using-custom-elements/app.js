class PersonCard extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow root to this element.
    this.shadow = this.attachShadow({ mode: "open" });

    // Create and attach a style tag which imports the CSS for this component.
    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("href", "./person.css");
    this.shadow.appendChild(styleLink);

    // Create and attach the main container, set the class.
    const container = document.createElement("div");
    container.setAttribute("class", "person-card");
    this.shadow.appendChild(container);

    // Create name line.
    const personName = document.createElement("h3");
    personName.setAttribute("id", "person-name");
    personName.innerText = `${this.getAttribute("person-name")}`;
    container.appendChild(personName);

    // Create age line.
    const personAge = document.createElement("div");
    personAge.setAttribute("id", "person-age");
    personAge.innerText = `Age: ${this.getAttribute("person-age")}`;
    container.appendChild(personAge);

    // Create email line.
    const personEmail = document.createElement("div");
    personEmail.setAttribute("id", "person-email");
    personEmail.innerText = `Email: ${this.getAttribute("person-email")}`;
    container.appendChild(personEmail);

    // Create button for changing name.
    const changeNameButton = document.createElement("button");
    changeNameButton.innerText = "Change Name";
    changeNameButton.onclick = () => {
      this.setAttribute("person-name", "Ron Swanson");
      this.setAttribute("person-email", "ron.swanson@pawnee.gov");
      this.setAttribute("person-age", 55);
    };
    container.appendChild(changeNameButton);
  }

  // Declare which attributes to observe for changes. The browser
  // will call this function.
  static get observedAttributes() {
    return ["person-name", "person-age", "person-email"];
  }

  // Invoked when one of the observed attributes changed.
  attributeChangedCallback(attrName, oldValue) {
    const newValue = this.getAttribute(attrName);
    console.log(`Attribute '${attrName}' changed form '${oldValue}' to '${newValue}'`);
    switch (attrName) {
      case "person-name":
        this.shadow.querySelector("#person-name").innerText = `${newValue}`;
        break;
      case "person-age":
        this.shadow.querySelector("#person-age").innerText = `Age: ${newValue}`;
        break;
      case "person-email":
        this.shadow.querySelector("#person-email").innerText = `Email: ${newValue}`;
        break;
    }
  }
}

// Register the custom element.
customElements.define("person-card", PersonCard);