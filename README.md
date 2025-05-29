
# Libby

**Libby** is a lightweight collection of reusable JavaScript utility functions designed to simplify common tasks like DOM manipulation, event handling, class toggling, persistence, and more. Perfect for quick prototyping or enhancing existing projects.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Features

- 🎯 **DOM Helpers**: Quickly select, remove elements, check visibility, convert HTML strings.
- 🕹 **Event Management**: Debounce functions, dispatch/handle events, one-time listeners.
- 🎨 **Class Manipulation**: Add/remove/toggle classes on elements.
- 💾 **Persistence**: Store data in localStorage, sessionStorage, or cookies.
- 🌐 **URL Utilities**: Easily retrieve query parameters.
- 📡 **Cross-Browser**: Works in all modern browsers.

---

## Installation

### Manual Download

1. Download [libby.js](https://raw.githubusercontent.com/RafaelOlivra/libby/refs/heads/main/libby.js)  
2. Include in your HTML:

```html
<script src="/path/to/libby.js"></script>
```

---

## Quick Start

```js
const btn = _el("#myButton");
const cards = _els(".card");

_on(btn, "click", _debounce(() => {
  _toggleClass(cards, "active");
  _dispatch(window, "cards:toggled");
}, 200));

// Persist data for 1 day
_persist("user_prefs", { darkMode: true }, 86400000);
```

---

## API Reference

### Core Selectors

#### `_el(selector, [parent])`
Select a single element.
```js
const header = _el("header");
```

#### `_els(selector, [parent])`
Select multiple elements.
```js
const items = _els(".card");
```

#### `_find(el, [parent])`
Low-level selector that always returns an array.
```js
const elements = _find("div");
```

#### `_remove(selector, [parent])`
Remove elements from the DOM.
```js
_remove(".temp-elements");
```

---

### DOM Helpers

#### `_toggleClass(el, classNames, [force])`
Toggle one or more classes.
```js
_toggleClass(modal, "active");
_toggleClass(btn, "loading", true);
```

#### `_addClass(el, classNames)`
Add classes to elements.
```js
_addClass(".card", "highlight");
```

#### `_removeClass(el, classNames)`
Remove classes from elements.
```js
_removeClass(".card", ["disabled", "blurred"]);
```

#### `_inViewport(el, container, [offset])`
Check if an element is visible.
```js
if (_inViewport(item, window, 100)) {
  console.log("Visible!");
}
```

#### `_parseHTML(str)`
Convert an HTML string to DOM elements.
```js
const el = _parseHTML('<div class="alert">Hello</div>');
```

---

### Event System

#### `_on(el, event, callback)`
Attach event listeners.
```js
const handlers = _on(window, "resize", () => console.log("resized"));
// Later: handlers.forEach(h => h.remove());
```

#### `_once(el, event, callback)`
Attach a one-time listener.
```js
_once("#start", "click", () => console.log("clicked once"));
```

#### `_dispatch(el, event, [detail], [delay])`
Trigger a custom event.
```js
_dispatch(modal, "show", { id: 1 }, 500);
```

#### `_debounce(func, wait, [immediate])`
Debounce a function.
```js
window.addEventListener("scroll", _debounce(logScroll, 200));
```

---

### Utility

#### `_is(el, selector)`
Check if element matches selector.
```js
if (_is("#btn", ".button")) {
  console.log("It's a button");
}
```

#### `_getUrlParam(name, [defaultValue])`
Get query param from URL.
```js
const ref = _getUrlParam("ref", "homepage");
```

---

### Persistence

#### `_persist(key, data, [expiration])`
Store data (supports `"session"`, `"local"` or timestamp in ms).
```js
_persist("temp", { id: 42 }, "session");
_persist("cache", data, 3600000); // 1 hour
```

#### `_persistGet(key)`
Retrieve data.
```js
const prefs = _persistGet("user_prefs");
```

Or shorthand:
```js
const prefs = _persist("user_prefs");
```

---

## Advanced Usage

### Scroll Check in Container

```js
const scrollArea = _el(".scroll-container");
const target = _el(".item");

_on(scrollArea, "scroll", () => {
  if (_inViewport(target, scrollArea)) {
    console.log("Visible!");
  }
});
```

---

## Debugging

Enable debug logs:

```html
<body class="dev">
```

---

## License

MIT © Rafael Oliveira. See [LICENSE](LICENSE) for full text.
