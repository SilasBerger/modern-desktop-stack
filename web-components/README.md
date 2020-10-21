# Web Components
![Web Components Logo](../images/web-components-logo.png)

Playground for trying out web components and custom elements.

## 📦 Projects
- [1-mdn-using-custom-elements](1-mdn-using-custom-elements): First custom element, based around the MDN tutorials on [using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and [using the shadow DOM](ttps://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).
- [2-mdn-using-templates-and-slots](2-mdn-using-templates-and-slots): Re-implementation of the first project, but with templates and slots. Based around the [corresponsing MDN tutorial](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).

## 📓 Study Notes
There are two types of custom elements: autonomous custom elements and customized built-in elements. While support for the former is already quite good in most modern browsers, the latter isn't yet supported everywhere. This project only discusses autonomous custom elements.

A custom element is simply a JavaScript class which extends the `HTMLElement` base class. To make it usable in HTML, that class then needs to be registered by calling `customElements.define("my-custom-element", MyCustomElement)`. The first argument is the name by which we can later use the element in HTML. Note: this name is required to have at least one hyphen! The second argument is the class which defines the custom element. We can then use the constructor of this class to set up the component (add elements, add a shadow DOM, etc).

The `HTMLElement` class comes with a few lifecycle callbacks, which we can override to define custom behavior. These include:
- `connectedCallback`: invoked when the custom element is appaneded to a document-connected element
- `disconnectedCallback`: invoked when the custom element is disconnected from the document's DOM
- `adoptedCallback`: invoked each time the custom element is moved to a new document
- `attributeChangedCallback`: invoked each time any of the custom element's observed attributes change (add, remove, update)

The `attributeChangedCallback` is how we can react to changes in properties. This is what we generally get "for free" in JS frameworks such as React or Angular. With raw web components, we need to define custom logic for what should happen upon such an update. The important part is that the callback is only invoked for updates on any of the custom element's **observed** attributes. We declare to the browser which attributes are observed by providing a `static get observedAttributes()` in our class, which returns an array of strings corresponding to the names of the attributes we want to observe.

In the class which defines the custom element, `this` refers to an `HTMLElement`, given the required inheritance. It therefore has all the functions we would normally expect from an HTMLElement in JavaScript, such as `getAttribute()` and `setAttribute()`.

The shadow DOM allows us to attach a separate DOM to an element - in this case, that element is usually going to be `this`, i.e. the root of the custom element. The shadow DOM can be manipulated exactly like the light DOM (i.e the regular DOM), with the difference that none of the code inside the shadow DOM can affect anything outside of it. We attach a shadow root to a custom element by calling `this.attachShadow({ mode: "open" })`. The `mode: open` setting allows for this shadow DOM to be manipulated by that JavaScript code which is defined outside of it. We usually save the result of that function call in a variable, so we can then attach children to it, just like we would do with any other HTML element.

To make it easier to define the inner structure of a custom element, we can use the `<template>` tag. Template elements are not rendered to the DOM. In our custom component class, we can then select the desired template by its id and attach a deep copy of its contents to the custom element's shadow DOM. This is just one way to work with templates, but to me it seems like the most useful one.

## 🎒 Resources
- [MDN Web Components Overview](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [MDN Tutorial: Using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [MDN Tutorial: Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [MDN Tutorial: templates and slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)