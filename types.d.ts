import {
    _el as _elType,
    _els as _elsType,
    _on as _onType,
    _once as _onceType,
    _debounce as
        _debounceType,
    _dispatch as _dispatchType,
    _is as _isType,
    _toggleClass as _toggleClassType,
    _addClass as _addClassType,
    _removeClass as _removeClassType,
    _toHTML as _toHTMLType,
    _inViewport as _inViewportType,
    _persist as _persistType,
    _persistGet as _persistGetType,
    _persistRemove as _persistRemoveType,
    _libbyLog as _libbyLogType,
    _libbyInit as _libbyInitType
} from './libby.js'

declare global {
    var _el: typeof _elType;
    var _els: typeof _elsType;
    var _on: typeof _onType;
    var _once: typeof _onceType;
    var _debounce: typeof _debounceType;
    var _dispatch: typeof _dispatchType;
    var _is: typeof _isType;
    var _toggleClass: typeof _toggleClassType;
    var _addClass: typeof _addClassType;
    var _removeClass: typeof _removeClassType;
    var _toHTML: typeof _toHTMLType;
    var _inViewport: typeof _inViewportType;
    var _persist: typeof _persistType;
    var _persistGet: typeof _persistGetType;
    var _persistRemove: typeof _persistRemoveType;
    var _libbyLog: typeof _libbyLogType;
    var _libbyReady: boolean;
    var _libbyInit: typeof _libbyInitType;
}