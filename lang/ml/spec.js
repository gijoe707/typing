// lang/ml/spec.js — Malayalam language spec for the typing app
// Exposes `window.LANG_SPEC` with all Malayalam-specific mappings

window.LANG_SPEC = {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    segmenterLocale: 'ml',
    CONS_RANGE: { lo: 0x0D15, hi: 0x0D39 },
    VOW_RANGE: { lo: 0x0D05, hi: 0x0D14 },
    VIRAMA: '\u0D4D',
    VOWEL_TO_MATRA: {
        'അ': null,
        'ആ': '\u0D3E',
        'ഇ': '\u0D3F',
        'ഈ': '\u0D40',
        'ഉ': '\u0D41',
        'ഊ': '\u0D42',
        'എ': '\u0D46',
        'ഏ': '\u0D47',
        'ഐ': '\u0D48',
        'ഒ': '\u0D4A',
        'ോ': '\u0D4B',
        'ൌ': '\u0D4C',
    },
    // NOTE: `KEY_MAP` will be generated from `TAM99_LAYOUT` below to
    // keep the layout as the single source of truth.

    // Malayalam keyboard layout (adapted from Tamil layout)
    TAM99_LAYOUT: [
        {
            row: 0, keys: [
                { code: 'Backquote', normal: '`', shift: '~', finger: 0 },
                { code: 'Digit1', normal: '൧', shift: '!', finger: 0 },
                { code: 'Digit2', normal: '൨', shift: '@', finger: 0 },
                { code: 'Digit3', normal: '൩', shift: '#', finger: 1 },
                { code: 'Digit4', normal: '൪', shift: '$', finger: 2 },
                { code: 'Digit5', normal: '൫', shift: '%', finger: 3 },
                { code: 'Digit6', normal: '൬', shift: '^', finger: 3 },
                { code: 'Digit7', normal: '൭', shift: '&', finger: 3 },
                { code: 'Digit8', normal: '൮', shift: '*', finger: 2 },
                { code: 'Digit9', normal: '൯', shift: '(', finger: 1 },
                { code: 'Digit0', normal: '൰', shift: ')', finger: 1 },
                { code: 'Minus', normal: '-', shift: '_', finger: 0 },
                { code: 'Equal', normal: '=', shift: '+', finger: 0 },
                { code: 'Backspace', normal: '⌫', shift: '⌫', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 1, keys: [
                { code: 'Tab', normal: 'Tab', shift: 'Tab', finger: 0, wide: 'wide-15', special: true },
                { code: 'KeyQ', normal: 'ആ', shift: 'ഷ', finger: 0 },
                { code: 'KeyW', normal: 'ഈ', shift: 'സ്ഥ', finger: 0 },
                { code: 'KeyE', normal: 'ഊ', shift: 'ജ', finger: 1 },
                { code: 'KeyR', normal: 'ഐ', shift: 'ഹ', finger: 2 },
                { code: 'KeyT', normal: 'ഏ', shift: 'ക്ഷ', finger: 3 },
                { code: 'KeyY', normal: 'ള', shift: 'ശ്രീ', finger: 3 },
                { code: 'KeyU', normal: 'ഺ', shift: 'ശ', finger: 3 },
                { code: 'KeyI', normal: 'ണ', shift: '', finger: 2 },
                { code: 'KeyO', normal: 'ട', shift: '[', finger: 1 },
                { code: 'KeyP', normal: 'ന', shift: ']', finger: 0 },
                { code: 'BracketLeft', normal: 'ച', shift: '{', finger: 0 },
                { code: 'BracketRight', normal: 'ഞ', shift: '}', finger: 0 },
                { code: 'Backslash', normal: '\\', shift: '|', finger: 0 },
            ]
        },
        {
            row: 2, keys: [
                { code: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 0, wide: 'wide-18', special: true },
                { code: 'KeyA', normal: 'അ', shift: 'തിരു', finger: 0 },
                { code: 'KeyS', normal: 'ഇ', shift: 'നി', finger: 0 },
                { code: 'KeyD', normal: 'ഉ', shift: 'ഐ', finger: 1 },
                { code: 'KeyF', normal: '്', shift: '&', finger: 2 },
                { code: 'KeyG', normal: 'എ', shift: 'ഏ', finger: 3 },
                { code: 'KeyH', normal: 'ക', shift: 'ങ', finger: 3 },
                { code: 'KeyJ', normal: 'പ', shift: 'ഞ', finger: 3 },
                { code: 'KeyK', normal: 'മ', shift: '"', finger: 2 },
                { code: 'KeyL', normal: 'ത', shift: ':', finger: 1 },
                { code: 'Semicolon', normal: 'ദ', shift: ';', finger: 0 },
                { code: 'Quote', normal: 'യ', shift: "'", finger: 0 },
                { code: 'Enter', normal: 'Enter', shift: 'Enter', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 3, keys: [
                { code: 'ShiftLeft', normal: 'Shift', shift: 'Shift', finger: 0, wide: 'wide-28', special: true },
                { code: 'KeyZ', normal: 'ോള', shift: 'വു', finger: 0 },
                { code: 'KeyX', normal: 'ോ', shift: 'ഒ', finger: 1 },
                { code: 'KeyC', normal: 'ഒ', shift: 'ോയ്', finger: 2 },
                { code: 'KeyV', normal: 'വ', shift: 'ള', finger: 3 },
                { code: 'KeyB', normal: 'ങ', shift: '൧', finger: 3 },
                { code: 'KeyN', normal: 'ല', shift: 'ങ', finger: 3 },
                { code: 'KeyM', normal: 'ര', shift: 'സ്', finger: 2 },
                { code: 'Comma', normal: ',', shift: '<', finger: 1 },
                { code: 'Period', normal: '.', shift: '>', finger: 0 },
                { code: 'Slash', normal: 'ഴ', shift: '/', finger: 0 },
                { code: 'ShiftRight', normal: 'Shift', shift: 'Shift', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 4, keys: [
                { code: 'ControlLeft', normal: 'Ctrl', shift: 'Ctrl', finger: 0, wide: 'wide-18', special: true },
                { code: 'AltLeft', normal: 'Alt', shift: 'Alt', finger: 0, wide: 'wide-18', special: true },
                { code: 'Space', normal: ' ', shift: ' ', finger: 4, wide: 'wide-40' },
                { code: 'AltRight', normal: 'Alt', shift: 'Alt', finger: 0, wide: 'wide-18', special: true },
                { code: 'ControlRight', normal: 'Ctrl', shift: 'Ctrl', finger: 0, wide: 'wide-18', special: true },
            ]
        },
    ],


    FINGER_NAMES: ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'],
    FINGER_COLORS: ['var(--pinky)', 'var(--ring)', 'var(--middle)', 'var(--index)', 'var(--thumb)'],
    FINGER_CLASSES: ['finger-pinky', 'finger-ring', 'finger-middle', 'finger-index', 'finger-thumb'],
};

// Generate `KEY_MAP` from `TAM99_LAYOUT` so maintainers only need to
// update the layout rows. If a `KEY_MAP` exists already, leave it.
(function () {
    if (!window.LANG_SPEC) return;
    if (window.LANG_SPEC.KEY_MAP && Object.keys(window.LANG_SPEC.KEY_MAP).length) return;
    const map = {};
    (window.LANG_SPEC.TAM99_LAYOUT || []).forEach(row => {
        (row.keys || []).forEach(k => {
            if (!k || !k.code) return;
            map[k.code] = { n: k.normal || '', s: k.shift || '' };
        });
    });
    window.LANG_SPEC.KEY_MAP = map;
})();
