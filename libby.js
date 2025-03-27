/**
 * RO Libby v1.0.2
 * A collection of reusable JS utility functions that can be used in any project.
 * Released under the MIT license
 */

/**
 * Find elements by matching a CSS selector or Native element
 * Note: This function will always return an array of elements, even if only one element is found.
 * For cases where the element is a Window or Document, the result will be an array with the reference to the element.
 * @param {string | Window | Document | Element | NodeList} el - The element(s) to find
 * @param {string} selector - The CSS selector to match
 * @param {Element | Document} [parent=document] - The parent element to search from
 * @returns {NodeList | Element[]} The elements that match the selector
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
}

/**
 * Get an element by selector
 * @param {string} selector - CSS selector
 * @param {Element | Document} [parent=document] - Parent element to search from
 * @returns {Element | null} The element or null if not found
 */
const _el = (selector, parent = document) => {
    return _find(selector, parent)[0];
}

/**
 * Get multiple elements by selector
 * @param {string} selector - CSS selector
 * @param {Element | Document} [parent=document] - Parent element to search from
 * @returns {NodeList | Element[]} The elements
 */
const _els = (selector, parent = document) => {
    return _find(selector, parent);
};

/**
 * Dispatch a custom event
 * @param {Element | Window | string} el - The element to dispatch the event on
 * @param {string} eventName - The name of the event
 * @param {object | string} detail - The event detail
 * @param {number} delay - The delay time before the event is dispatched
 */
const _dispatch = (el, eventName, detail = {}, delay = 0) => {
    const _el = _find(el)[0];

    // Bail if no element was found
    if (!_el) return;

    // Dispatch the event with a delay
    try {
        if (delay) {
            setTimeout(function () {
                _el.dispatchEvent(new CustomEvent(eventName, {
                    detail: detail
                }));
            }, delay);
        }
        // Dispatch the event immediately
        else {
            _el.dispatchEvent(new CustomEvent(eventName, {
                detail: detail
            }));
        }

        _libbyLog("[_dispatch]", eventName, delay);
    } catch (error) {
        _libbyLog("[_dispatch] Error dispatching event:", error, eventName, delay, _el);
    }
};

/**
 * Add an event listener to one or more elements.
 * Returns an array of event listeners so they can be removed later.
 * 
 * @param {Element | Window | Document | NodeList | string} el - The element(s) to add the event listener to
 * @param {string} eventName - The name of the event
 * @param {function} callback - The callback function
 * 
 * @returns {object[]} An array of event listeners
 */
const _on = (el, eventName, callback) => {
    const els = _find(el);

    // Bail if no elements were found
    if (els.length === 0) return;

    const eventListeners = [];

    // Add event listener to each element
    els.forEach(element => {
        const eventListener = (e) => {
            callback(e, e.detail); // Invoke the callback with event and optional detail
        };

        element.addEventListener(eventName, eventListener);

        _libbyLog("[_on] Added event listener:", eventName);

        // Store a remove function for later use
        eventListeners.push({
            remove: function () {
                element.removeEventListener(eventName, eventListener);
            }
        });
    });

    return eventListeners;
};

/**
 * Add an event listener to one or more elements that only runs once.
 * 
 * @param {Element | Window | Document | NodeList | string} el - The element(s) to add the event listener to
 * @param {string} eventName - The name of the event
 * @param {function} callback - The callback function
 * 
 * @returns {object[]} An array of event listeners
 */
const _once = (el, eventName, callback) => {
    const els = _find(el);

    // Bail if no elements were found
    if (els.length === 0) return;

    const eventListeners = [];

    // Add event listener to each element
    els.forEach(element => {
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
            }
        });
    });

    return eventListeners;
};

/**
 * Check if an element matches a selector
 * @param {Element | string} el - The element to check
 * @param {string} selector - The selector to check against
 * @returns {boolean} Whether the element matches the selector
 * */
const _is = (el, selector) => {
    const _el = _find(el)[0];

    // Bail if no element was found
    if (!_el) return;

    return _el.matches(selector);
}

/**
 * Toggle one or more classes on one or more elements.
 * 
 * @param {Element | NodeList | string} el - The element(s) to toggle the class on
 * @param {string | string[]} classNames - The class name(s) to toggle
 * @param {boolean | null} [toggleOnValue=null] - Whether to add/remove classes based on this value, or toggle if null
 */
const _toggleClass = (el, classNames, toggleOnValue = null) => {
    const els = _find(el);

    // Bail if no elements were found
    if (els.length === 0) return;

    // Ensure classNames is an array
    const classes = Array.isArray(classNames) ? classNames : classNames.split(/\s+/);

    // Toggle classes for each element
    els.forEach(element => {
        classes.forEach(className => {
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
 * Add one or more classes to an element.
 * A wrapper for _toggleClass with toggleOnValue set to true.
 * 
 * @param {Element | NodeList | string} el - The element(s) to add the class to
 * @param {string | string[]} classNames - The class name(s) to add
 */
const _addClass = (el, classNames) => {
    _toggleClass(el, classNames, true);
}

/**
 * Remove one or more classes from an element.
 * A wrapper for _toggleClass with toggleOnValue set to false.
 * 
 * @param {Element | NodeList | string} el - The element(s) to remove the class from
 * @param {string | string[]} classNames - The class name(s) to remove
 */
const _removeClass = (el, classNames) => {
    _toggleClass(el, classNames, false);
}

/**
 * Convert a string to an HTML element
 * @param {string} str - The string to convert
 * @param {boolean} [decode=true] - Whether to decode the string
 * @returns {HTMLElement} The HTML element
 * */
const _parseHTML = (str, decode = true) => {

    if (!str) {
        _libbyLog("[_parseHTML] Invalid string:", str);
        return null;
    }

    if (decode) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        str = textarea.value;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body.innerHTML;
}

/**
 * Debounce a function
 * @https://gist.github.com/nmsdvid/8807205
 *
 * @param {function} func - The function to debounce
 * @param {number} wait - The wait time before the function is called
 * @param {boolean} [immediate=false] - Whether the function should be called immediately
 * @returns {function} The debounced function
 * */
const _debounce = (func, wait, immediate = false) => {
    var timeout;
    _libbyLog("[_debounce] Debounce event set", wait);
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

/**
 * Check if an element is visible in the viewport of a given container
 * 
 * @param {Element | string} el - The element to check
 * @param {Element | Window | string} target - The container element (e.g., scrollable div). Use `window` for the default viewport.
 * @param {number} offset - Offset to adjust the visibility threshold (default is half of the current innerHeight - From bottom)
 * @returns {boolean} - True if the element is in the viewport of the target, false otherwise
 */
const _inViewport = (el, target, offset = window.innerHeight / 2) => {
    const _el = _find(el)[0];
    const _target = _find(target)[0];

    // Bail if no element was found
    if (!_el || !_target) return;

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
}

/**
 * Store data in localStorage, sessionStorage, or cookies with an optional expiration time
 * @param {string} key - The key under which the data is stored
 * @param {any} data - The data to store (will be serialized as JSON)
 * @param {number | string} [expirationTime] - The time in milliseconds after which the data should expire, or "session" for sessionStorage
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
        expiration: typeof expirationTime === "number" ? Date.now() + expirationTime : expirationTime,
    };

    try {
        if (storage) {
            // Use localStorage or sessionStorage if available
            storage.setItem(key, JSON.stringify(value));
        } else {
            // Fallback to cookies if both localStorage and sessionStorage are unavailable
            const expires = expirationTime && typeof expirationTime === "number"
                ? `; expires=${new Date(Date.now() + expirationTime).toUTCString()}`
                : '';
            document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/`;
        }

        _libbyLog("[_persistGet] Stored data:", key, value);
    } catch (error) {
        _libbyLog("[_persist] Error storing data:", error);
    }
};

/**
 * Helper function to retrieve data from storage (localStorage, sessionStorage, or cookies)
 * @param {string} key - The key under which the data is stored
 * @returns {any} The stored data or null if not found
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
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(row => row.startsWith(`${key}=`));
            if (cookie) {
                value = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
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
 * Helper function to remove data from storage (localStorage, sessionStorage, or cookies)
 * @param {string} key - The key under which the data is stored
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

// Log messages to the console if the body has a .dev class
const _libbyLog = (...params) => {
    if (_is("body", ".dev")) {
        console.debug(...params);
    }
}

// Add the functions to the window object
const _libbyInit = () => {
    window._debounce = _debounce;
    window._dispatch = _dispatch;
    window._find = _find;
    window._el = _el;
    window._els = _els;
    window._on = _on;
    window._once = _once;
    window._is = _is;
    window._toggleClass = _toggleClass;
    window._addClass = _addClass;
    window._removeClass = _removeClass;
    window._parseHTML = _parseHTML;
    window._inViewport = _inViewport;
    window._persist = _persist;
    window._persistGet = _persistGet;
    window._persistRemove = _persistRemove;
    window._libbyLog = _libbyLog;
}
_libbyInit();

// Dispatch a ready event when the window is loaded
document.addEventListener("DOMContentLoaded", function (event) {
    window._libbyReady = true;
    _dispatch(window, "libby:ready");
});

// Export functions, utilized to setup TypeScript types
export {
    _find,
    _el,
    _els,
    _dispatch,
    _on,
    _once,
    _is,
    _toggleClass,
    _addClass,
    _removeClass,
    _parseHTML,
    _debounce,
    _inViewport,
    _persist,
    _persistGet,
    _persistRemove,
    _libbyLog,
    _libbyInit
};