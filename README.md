# Libby

**Libby** is a lightweight collection of reusable JavaScript utility functions designed to simplify common tasks like DOM manipulation, event handling, class
toggling, persistence, and more. Perfect for quick prototyping or enhancing existing projects.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

-   🎯 **DOM Helpers**: Quickly select elements, check visibility, convert HTML strings.
-   🕹 **Event Management**: Debounce functions, dispatch/handle events with ease.
-   🎨 **Class Manipulation**: Add/remove/toggle classes on elements.
-   💾 **Persistence**: Store data in localStorage, sessionStorage, or cookies.
-   📡 **Cross-Browser**: Works in all modern browsers.
-   🪶 **Lightweight**: ~3KB minified (1.5KB gzipped).

## Installation

### Manual Download

1. Download [libby.js](https://raw.githubusercontent.com/RafaelOlivra/libby/refs/heads/main/libby.js)
2. Include in your HTML:

```html
<script src="/path/to/libby.js"></script>
```

## Quick Start

```javascript
// Get elements
const btn = _el("#myButton");
const cards = _els(".card");

// Handle click with debounce
_on(
    btn,
    "click",
    _debounce(() => {
        _toggleClass(cards, "active"); // Toggle class
        _dispatch(window, "cards:toggled"); // Custom event
    }, 200),
);

// Persist data for 1 day
_persist("user_prefs", { darkMode: true }, 86400000);
```

## API Reference

### Core Functions

#### `_el(selector, [parent])`

**Select single element**

```javascript
const header = _el("header");
const nested = _el(".item", someParentElement);
```

#### `_els(selector, [parent])`

**Select multiple elements**

```javascript
const images = _els("img.thumbnail");
```

**Note**: Both `_el` and `_els` are just wrappers for the `_find` function.

#### `_on(element, event, callback)`

**Event listener**

```javascript
const listeners = _on(window, "resize", () => {
    console.log("Window resized!");
});

// Remove later
listeners.forEach((l) => l.remove());
```

### DOM Helpers

#### `_toggleClass(element, classes, [force])`

**Toggle classes**

```javascript
// Toggle 'active' class
_toggleClass(modal, "active");

// Force-add 'loading' class
_toggleClass(button, "loading", true);
```

#### `_inViewport(element, container, [offset])`

**Check visibility**

```javascript
if (_inViewport(myElement, window, 100)) {
    console.log("Element is visible!");
}
```

### Event System

#### `_dispatch(target, eventName, [detail], [delay])`

**Trigger custom event**

```javascript
// Dispatch with data after 1s
_dispatch(modal, "animation:complete", { duration: 300 }, 1000);
```

#### `_debounce(func, wait, [immediate])`

**Debounce expensive operations**

```javascript
window.addEventListener(
    "resize",
    _debounce(() => {
        console.log("Resize handler!");
    }, 250),
);
```

### Persistence

#### `_persist(key, data, [expiration])`

**Store data**

```javascript
// Store for session
_persist("temp_data", { id: 42 }, "session");

// Store for 1 hour
_persist("cached_results", results, 3600000);
```

#### `_persistGet(key)`

**Retrieve data**

```javascript
const prefs = _persistGet("user_prefs");
```

Alternatively, you can also use `_persist(key)` to retrieve the stored value.

## Advanced Usage

### HTML Conversion

```javascript
const htmlString = '<div class="alert">Hello!</div>';
const element = _parseHTML(htmlString);
document.body.append(element);
```

### Event Once

```javascript
_once("#welcome-modal", "click", () => {
    analytics.track("modal_first_click");
});
```

### Visibility Check in Container

```javascript
const scrollArea = _el(".scroll-container");
const targetItem = _el(".special-item");

scrollArea.addEventListener("scroll", () => {
    if (_inViewport(targetItem, scrollArea)) {
        console.log("Item visible in scroll container!");
    }
});
```

## License

MIT © Rafael Oliveira. See [LICENSE](LICENSE) for full text.

---

**Pro Tip**: Add `dev` class to your `<body>` tag to enable debug logging!

```html
<body class="dev">
    <!-- Your content -->
</body>
```
