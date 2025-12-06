/**
 * RO Libby v1.0.9
 * A collection of reusable JS utility functions for any project.
 * Released under the MIT license.
 */

/**
 * @typedef {string | Window | Document | Element | Element[] | NodeListOf<Element>} LibbyTarget
 * A selector or DOM element(s) accepted by RO Libby functions.
 */

/**
 * Find one or more DOM elements.
 *
 * Always returns an array of found elements.
 *
 * @param {LibbyTarget} el
 *        Selector or element(s) to search.
 * @param {Element | Document} [parent=document]
 *        Parent to query inside when using a selector.
 * @returns {(Element | Document | Window)[]}
 *          Array of matched elements (may be empty).
 */
const _find = (el, parent = document) => {
  let els = [];

  // Convert `el` to an array of elements
  if (typeof el === "string") {
    els = parent.querySelectorAll(el);
  } else if (el instanceof Element) {
    els = [el];
  } else if (el instanceof NodeList) {
    els = el;
  } else if (el instanceof Window || el instanceof Document) {
    els = [el];
  }

  // Log if no elements were found
  if (els.length === 0) {
    _libbyLog("[_find] No elements found:", el, parent);
  }

  return els;
};

/**
 * Get the first element matching a selector.
 *
 * @param {LibbyTarget} selector
 * @param {Element | Document} [parent=document]
 * @returns {Element | null} First matching element or null.
 */
const _el = (selector, parent = document) => {
  return _find(selector, parent)[0] || null;
};

/**
 * Get all elements matching a selector.
 *
 * @param {LibbyTarget} selector
 * @param {Element | Document} [parent=document]
 * @returns {Element[]} Array of matched elements (possibly empty).
 */
const _els = (selector, parent = document) => {
  return _find(selector, parent);
};

/**
 * Remove elements matching a selector.
 *
 * @param {LibbyTarget} selector
 * @param {Element | Document} [parent=document]
 * @returns {boolean} True if any element was removed.
 */
const _remove = (selector, parent = document) => {
  const _els = _find(selector, parent);

  // Bail if no elements were found
  if (_els.length === 0) return false;

  try {
    _els.forEach((el) => el.remove());
    _libbyLog("[_remove] Elements removed:", _els);
    return true;
  } catch (error) {
    _libbyLog("[_remove] Error removing elements:", error, _els);
  }

  return false;
};

/**
 * Dispatch a CustomEvent on a target element.
 *
 * @param {Element | Window | string} el
 * @param {string} eventName
 * @param {object | string} [detail={}]
 * @param {number} [delay=0] Dispatch after delay (ms).
 */
const _dispatch = (el, eventName, detail = {}, delay = 0) => {
  const _el = _find(el)[0];

  // Bail if no element was found
  if (!_el) return;

  // Dispatch the event with a delay
  try {
    if (delay) {
      setTimeout(function () {
        _el.dispatchEvent(
          new CustomEvent(eventName, {
            detail: detail,
          }),
        );
      }, delay);
    }
    // Dispatch the event immediately
    else {
      _el.dispatchEvent(
        new CustomEvent(eventName, {
          detail: detail,
        }),
      );
    }

    _libbyLog("[_dispatch]", eventName, delay);
  } catch (error) {
    _libbyLog(
      "[_dispatch] Error dispatching event:",
      error,
      eventName,
      delay,
      _el,
    );
  }
};

/**
 * Add an event listener to one or more elements.
 *
 * @param {LibbyTarget} el
 * @param {string} eventName
 * @param {(ev: Event, detail?: any) => void} callback
 * @returns {{ remove: () => void }[]}
 *          Array of objects containing a `remove()` function.
 */
const _on = (el, eventName, callback) => {
  const els = _find(el);

  // Bail if no elements were found
  if (els.length === 0) return;

  const eventListeners = [];

  // Add event listener to each element
  els.forEach((element) => {
    const eventListener = (e) => {
      callback(e, e.detail); // Invoke the callback with event and optional detail
    };

    element.addEventListener(eventName, eventListener);

    _libbyLog("[_on] Added event listener:", eventName);

    // Store a remove function for later use
    eventListeners.push({
      remove: function () {
        element.removeEventListener(eventName, eventListener);
      },
    });
  });

  return eventListeners;
};

/**
 * Add a one-time event listener to one or more elements.
 *
 * @param {LibbyTarget} el
 * @param {string} eventName
 * @param {(ev: Event, detail?: any) => void} callback
 * @returns {{ remove: () => void }[]}
 */
const _once = (el, eventName, callback) => {
  const els = _find(el);

  // Bail if no elements were found
  if (els.length === 0) return;

  const eventListeners = [];

  // Add event listener to each element
  els.forEach((element) => {
    const eventListener = (e) => {
      callback(e, e.detail); // Invoke the callback with event and optional detail
    };

    // Add the event listener with the `once: true` option
    element.addEventListener(eventName, eventListener, { once: true });

    _libbyLog("[_once] Added event listener:", eventName);

    // Store a remove function for later use
    eventListeners.push({
      remove: function () {
        element.removeEventListener(eventName, eventListener);
      },
    });
  });

  return eventListeners;
};

/**
 * Check if an element matches a CSS selector.
 *
 * @param {LibbyTarget} el
 * @param {string} selector
 * @returns {boolean} True if the element matches.
 */
const _is = (el, selector) => {
  const _el = _find(el)[0];

  // Bail if no element was found
  if (!_el) return;

  return _el.matches(selector);
};

/**
 * Toggle one or more class names on one or more elements.
 *
 * @param {LibbyTarget} el
 * @param {string | string[]} classNames
 * @param {boolean | null} [toggleOnValue=null]
 *        - true: force add
 *        - false: force remove
 *        - null: toggle
 */
const _toggleClass = (el, classNames, toggleOnValue = null) => {
  const els = _find(el);

  // Bail if no elements were found
  if (els.length === 0) return;

  // Ensure classNames is an array
  const classes = Array.isArray(classNames)
    ? classNames
    : classNames.split(/\s+/);

  // Toggle classes for each element
  els.forEach((element) => {
    classes.forEach((className) => {
      if (toggleOnValue === null) {
        element.classList.toggle(className);
      } else if (toggleOnValue) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    });
  });
};

/**
 * Add one or more classes to elements.
 *
 * @param {LibbyTarget} el
 * @param {string | string[]} classNames
 */
const _addClass = (el, classNames) => {
  _toggleClass(el, classNames, true);
};

/**
 * Remove one or more classes from elements.
 *
 * @param {LibbyTarget} el
 * @param {string | string[]} classNames
 */
const _removeClass = (el, classNames) => {
  _toggleClass(el, classNames, false);
};

/**
 * Convert an HTML string into a DOM element.
 *
 * @param {string} str
 * @param {boolean} [decode=true]
 * @returns {HTMLElement | null} Parsed element or null.
 */
const _parseHTML = (str, decode = true) => {
  if (!str) {
    _libbyLog("[_parseHTML] Invalid string:", str);
    return null;
  }

  if (decode) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    str = textarea.value;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");

  return doc.body.firstChild;
};

/**
 * Get a URL query parameter.
 *
 * @param {string} name
 * @param {string | null} [defaultValue=null]
 * @returns {string | null}
 */
const _getUrlParam = (name, defaultValue = null) => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(name);
  return value !== null ? value : defaultValue;
};

/**
 * Debounce a function.
 * @https://gist.github.com/nmsdvid/8807205
 *
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} [immediate=false]
 * @returns {Function} Debounced wrapper.
 */
const _debounce = (func, wait, immediate = false) => {
  var timeout;
  _libbyLog("[_debounce] Debounce event set", wait);
  return function () {
    var context = this,
      args = arguments;
    if (immediate) func.apply(context, args);
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};

/**
 * Check if an element is inside the viewport or inside a scrollable container.
 *
 * @param {LibbyTarget} el
 * @param {LibbyTarget} target
 * @param {number} [offset=window.innerHeight/2]
 * @returns {boolean}
 */
const _inViewport = (el, target, offset = window.innerHeight / 2) => {
  const _el = _find(el)[0];
  const _target = target ? _find(target)[0] : window;

  // Bail if no element was found
  if (!_el || !_target) return false;

  const rect = _el.getBoundingClientRect();

  if (target === window) {
    return (
      rect.top < window.innerHeight - offset &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  } else {
    const targetRect = _target.getBoundingClientRect();

    return (
      rect.top < targetRect.bottom - offset &&
      rect.bottom > targetRect.top &&
      rect.left < targetRect.right &&
      rect.right > targetRect.left
    );
  }
};

/**
 * Store data persistently using localStorage, sessionStorage, or cookies.
 *
 * @param {string} key
 * @param {any} [data=null]
 * @param {number | string} [expirationTime=604800]
 *        Number (ms) or "session".
 * @returns {any} Existing stored value when called without `data`.
 */
const _persist = (key, data = null, expirationTime = 604800) => {
  if (typeof key !== "string" || key.trim() === "") {
    _libbyLog("[_persist] Invalid key:", key);
    return;
  }

  // If store is called with no data, return the stored data
  if (data === null) {
    return _persistGet(key);
  }

  const storage = expirationTime === "session" ? sessionStorage : localStorage;
  const value = {
    data,
    expiration:
      typeof expirationTime === "number"
        ? Date.now() + expirationTime
        : expirationTime,
  };

  try {
    if (storage) {
      // Use localStorage or sessionStorage if available
      storage.setItem(key, JSON.stringify(value));
    } else {
      // Fallback to cookies if both localStorage and sessionStorage are unavailable
      const expires =
        expirationTime && typeof expirationTime === "number"
          ? `; expires=${new Date(Date.now() + expirationTime).toUTCString()}`
          : "";
      document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/`;
    }

    _libbyLog("[_persistGet] Stored data:", key, value);
  } catch (error) {
    _libbyLog("[_persist] Error storing data:", error);
  }
};

/**
 * Retrieve persisted data.
 *
 * @param {string} key
 * @returns {any | null} Parsed data, or null if missing or expired.
 */
const _persistGet = (key) => {
  if (typeof key !== "string" || key.trim() === "") {
    _libbyLog("[_persistGet] Invalid key:", key);
    return;
  }

  let value = null;
  let storageType = "sessionStorage";

  try {
    // Try sessionStorage for "session" data
    let storageValue = sessionStorage ? sessionStorage.getItem(key) : null;
    if (storageValue) {
      value = JSON.parse(storageValue);
      if (value && value.expiration === "session") {
        _libbyLog(`[_persistGet] Retrieved ${storageType} data:`, key, value);
        return value.data;
      } else {
        value = null;
      }
    }

    // Try localStorage if sessionStorage is not available or invalid
    if (!value && localStorage) {
      storageType = "localStorage";
      storageValue = localStorage ? localStorage.getItem(key) : null;
      if (storageValue) {
        value = JSON.parse(storageValue);
      }
    }

    // Fallback to cookies if not found in localStorage/sessionStorage
    if (!value) {
      storageType = "cookie";
      const cookies = document.cookie.split("; ");
      const cookie = cookies.find((row) => row.startsWith(`${key}=`));
      if (cookie) {
        value = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      }
    }
  } catch (error) {
    _libbyLog("[_persistGet] Error retrieving data:", error);
  }

  // If the data has expired, return null
  if (value && value.expiration && value.expiration < Date.now()) {
    _persistRemove(key); // Remove expired data
    return null;
  }

  _libbyLog(`[_persistGet] Retrieved ${storageType} data:`, key, value);

  return value ? value.data : null;
};

/**
 * Remove persisted data.
 *
 * @param {string} key
 */
const _persistRemove = (key) => {
  if (typeof key !== "string" || key.trim() === "") {
    _libbyLog("[_persistRemove] Invalid key:", key);
    return;
  }

  try {
    // Remove from sessionStorage and localStorage if available
    if (sessionStorage) {
      sessionStorage.removeItem(key);
    }
    if (localStorage) {
      localStorage.removeItem(key);
    }

    // Remove from cookies if necessary
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

    _libbyLog("[_persistGet] Removed data:", key);
  } catch (error) {
    _libbyLog("[_persistRemove] Error removing data:", error);
  }
};

/**
 * Debug logger (active only when <body class="dev">).
 *
 * @param {...any} params
 */
const _libbyLog = (...params) => {
  if (_is("body", ".dev")) return console.debug(...params);
};

/**
 * Initialize global `_libby*` functions on `window`.
 *
 * Should only run once.
 */
const _libbyInit = () => {
  if (window._libbyReady) return;

  window._debounce = _debounce;
  window._dispatch = _dispatch;
  window._find = _find;
  window._el = _el;
  window._els = _els;
  window._remove = _remove;
  window._on = _on;
  window._once = _once;
  window._is = _is;
  window._toggleClass = _toggleClass;
  window._addClass = _addClass;
  window._removeClass = _removeClass;
  window._parseHTML = _parseHTML;
  window._getUrlParam = _getUrlParam;
  window._inViewport = _inViewport;
  window._persist = _persist;
  window._persistGet = _persistGet;
  window._persistRemove = _persistRemove;
  window._libbyLog = _libbyLog;
};
_libbyInit();

// Dispatch a ready event when the window is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    if (window._libbyReady) return;

    window._libbyReady = true;
    _dispatch(window, "libby:ready");
  });
} else {
  setTimeout(async () => {
    if (window._libbyReady) return;

    window._libbyReady = true;
    _dispatch(window, "libby:ready");
  }, 100);
}

// Export functions, utilized to setup TypeScript types
export {
  _find,
  _el,
  _els,
  _remove,
  _dispatch,
  _on,
  _once,
  _is,
  _toggleClass,
  _addClass,
  _removeClass,
  _parseHTML,
  _getUrlParam,
  _debounce,
  _inViewport,
  _persist,
  _persistGet,
  _persistRemove,
  _libbyLog,
  _libbyInit,
};
