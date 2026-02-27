// lang/kn/spec.js — Kannada language spec for the typing app
// Exposes `window.LANG_SPEC` with Kannada-specific mappings (scaffold)

window.LANG_SPEC = {
    id: 'kn',
    segmenterLocale: 'kn',
    CONS_RANGE: { lo: 0x0C95, hi: 0x0CB9 },
    VOW_RANGE: { lo: 0x0C85, hi: 0x0C94 },
    VIRAMA: '\u0CCD',
    VOWEL_TO_MATRA: {
        'ಅ': null,
        'ಆ': '\u0CBE',
        'ಇ': '\u0CBF',
        'ಈ': '\u0CC0',
        'ಉ': '\u0CC1',
        'ಊ': '\u0CC2',
        'ಎ': '\u0CC6',
        'ಏ': '\u0CC7',
        'ಐ': '\u0CC8',
        'ಒ': '\u0CCA',
        'ಓ': '\u0CCB',
        'ಔ': '\u0CCC',
    },

    // TAM99 layout rows (copy from Tamil scaffold; adjust as needed)
    TAM99_LAYOUT: [
        {
            row: 0, keys: [
                { code: 'Backquote', normal: '`', shift: '~', finger: 0 },
                { code: 'Digit1', normal: '1', shift: '!', finger: 0 },
                { code: 'Digit2', normal: '2', shift: '@', finger: 0 },
                { code: 'Digit3', normal: '3', shift: '#', finger: 1 },
                { code: 'Digit4', normal: '4', shift: '$', finger: 2 },
                { code: 'Digit5', normal: '5', shift: '%', finger: 3 },
                { code: 'Digit6', normal: '6', shift: '^', finger: 3 },
                { code: 'Digit7', normal: '7', shift: '&', finger: 3 },
                { code: 'Digit8', normal: '8', shift: '*', finger: 2 },
                { code: 'Digit9', normal: '9', shift: '(', finger: 1 },
                { code: 'Digit0', normal: '0', shift: ')', finger: 1 },
                { code: 'Minus', normal: '-', shift: '_', finger: 0 },
                { code: 'Equal', normal: '=', shift: '+', finger: 0 },
                { code: 'Backspace', normal: '⌫', shift: '⌫', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 1, keys: [
                { code: 'Tab', normal: 'Tab', shift: 'Tab', finger: 0, wide: 'wide-15', special: true },
                { code: 'KeyQ', normal: 'ಕ', shift: 'ಕ', finger: 0 },
                { code: 'KeyW', normal: 'ಖ', shift: 'ಖ', finger: 0 },
                { code: 'KeyE', normal: 'ಗ', shift: 'ಗ', finger: 1 },
                { code: 'KeyR', normal: 'ಘ', shift: 'ಘ', finger: 2 },
                { code: 'KeyT', normal: 'ಙ', shift: 'ಙ', finger: 3 },
                { code: 'KeyY', normal: 'ಚ', shift: 'ಚ', finger: 3 },
                { code: 'KeyU', normal: 'ಛ', shift: 'ಛ', finger: 3 },
                { code: 'KeyI', normal: 'ಜ', shift: 'ಜ', finger: 2 },
                { code: 'KeyO', normal: 'ಝ', shift: '[', finger: 1 },
                { code: 'KeyP', normal: 'ಞ', shift: ']', finger: 0 },
                { code: 'BracketLeft', normal: 'ಟ', shift: '{', finger: 0 },
                { code: 'BracketRight', normal: 'ಠ', shift: '}', finger: 0 },
                { code: 'Backslash', normal: '\\', shift: '|', finger: 0, wide: 'wide-15' },
            ]
        },
        {
            row: 2, keys: [
                { code: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 0, wide: 'wide-18', special: true },
                { code: 'KeyA', normal: 'ಅ', shift: 'ಆ', finger: 0 },
                { code: 'KeyS', normal: 'ಇ', shift: 'ಈ', finger: 0 },
                { code: 'KeyD', normal: 'ಉ', shift: 'ಊ', finger: 1 },
                { code: 'KeyF', normal: 'ಋ', shift: 'ಋ', finger: 2 },
                { code: 'KeyG', normal: 'ಎ', shift: 'ಎ', finger: 3 },
                { code: 'KeyH', normal: 'ಏ', shift: 'ಏ', finger: 3 },
                { code: 'KeyJ', normal: 'ಐ', shift: 'ಐ', finger: 3 },
                { code: 'KeyK', normal: 'ಒ', shift: 'ಒ', finger: 2 },
                { code: 'KeyL', normal: 'ಓ', shift: ':', finger: 1 },
                { code: 'Semicolon', normal: 'ಔ', shift: ';', finger: 0 },
                { code: 'Quote', normal: 'ಯ', shift: "'", finger: 0 },
                { code: 'Enter', normal: '↵ Enter', shift: '↵', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 3, keys: [
                { code: 'ShiftLeft', normal: '⇧ Shift', shift: '⇧', finger: 0, wide: 'wide-22', special: true },
                { code: 'KeyZ', normal: 'ಋ', shift: 'ಋ', finger: 0 },
                { code: 'KeyX', normal: 'ೠ', shift: 'ೠ', finger: 1 },
                { code: 'KeyC', normal: 'ಔ', shift: 'ಔ', finger: 2 },
                { code: 'KeyV', normal: 'ವ', shift: 'ವ', finger: 3 },
                { code: 'KeyB', normal: 'ಶ', shift: 'ಶ', finger: 3 },
                { code: 'KeyN', normal: 'ಷ', shift: 'ಷ', finger: 3 },
                { code: 'KeyM', normal: 'ಸ', shift: 'ಸ', finger: 2 },
                { code: 'Comma', normal: ',', shift: '<', finger: 1 },
                { code: 'Period', normal: '.', shift: '>', finger: 0 },
                { code: 'Slash', normal: 'ಹ', shift: '/', finger: 0 },
                { code: 'ShiftRight', normal: '⇧ Shift', shift: '⇧', finger: 0, wide: 'wide-28', special: true },
            ]
        },
        {
            row: 4, keys: [
                { code: 'ControlLeft', normal: 'Ctrl', shift: 'Ctrl', finger: 0, wide: 'wide-15', special: true },
                { code: 'AltLeft', normal: 'Alt', shift: 'Alt', finger: 0, wide: 'wide-15', special: true },
                { code: 'Space', normal: 'Space', shift: 'Space', finger: 4, wide: 'wide-40', special: true },
                { code: 'AltRight', normal: 'Alt', shift: 'Alt', finger: 0, wide: 'wide-15', special: true },
                { code: 'ControlRight', normal: 'Ctrl', shift: 'Ctrl', finger: 0, wide: 'wide-15', special: true },
            ]
        },
    ],

    FINGER_NAMES: ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'],
    FINGER_COLORS: ['var(--pinky)', 'var(--ring)', 'var(--middle)', 'var(--index)', 'var(--thumb)'],
    FINGER_CLASSES: ['finger-pinky', 'finger-ring', 'finger-middle', 'finger-index', 'finger-thumb'],

    UI: {
        fonts: ['Noto Sans Kannada', 'Noto Serif Kannada'],
        labels: { startPrompt: '⌨ Click here or start typing to begin' }
    }
};

// Generate `KEY_MAP` from `TAM99_LAYOUT` so the layout is available
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
