// lang/te/spec.js — Telugu language spec for the typing app
// Exposes `window.LANG_SPEC` with Telugu-specific mappings (scaffold)

window.LANG_SPEC = {
    id: 'te',
    segmenterLocale: 'te',
    CONS_RANGE: { lo: 0x0C15, hi: 0x0C39 },
    VOW_RANGE: { lo: 0x0C05, hi: 0x0C14 },
    VIRAMA: '\u0C4D',
    VOWEL_TO_MATRA: {
        'అ': null,
        'ఆ': '\u0C3E',
        'ఇ': '\u0C3F',
        'ఈ': '\u0C40',
        'ఉ': '\u0C41',
        'ఊ': '\u0C42',
        'ఎ': '\u0C46',
        'ఏ': '\u0C47',
        'ఐ': '\u0C48',
        'ఒ': '\u0C4A',
        'ఓ': '\u0C4B',
        'ఔ': '\u0C4C',
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
                { code: 'KeyQ', normal: 'క', shift: 'క', finger: 0 },
                { code: 'KeyW', normal: 'ఖ', shift: 'ఖ', finger: 0 },
                { code: 'KeyE', normal: 'గ', shift: 'గ', finger: 1 },
                { code: 'KeyR', normal: 'ఘ', shift: 'ఘ', finger: 2 },
                { code: 'KeyT', normal: 'ఙ', shift: 'ఙ', finger: 3 },
                { code: 'KeyY', normal: 'చ', shift: 'చ', finger: 3 },
                { code: 'KeyU', normal: 'ఛ', shift: 'ఛ', finger: 3 },
                { code: 'KeyI', normal: 'జ', shift: 'జ', finger: 2 },
                { code: 'KeyO', normal: 'ఝ', shift: '[', finger: 1 },
                { code: 'KeyP', normal: 'ఞ', shift: ']', finger: 0 },
                { code: 'BracketLeft', normal: 'ట', shift: '{', finger: 0 },
                { code: 'BracketRight', normal: 'ఠ', shift: '}', finger: 0 },
                { code: 'Backslash', normal: '\\', shift: '|', finger: 0, wide: 'wide-15' },
            ]
        },
        {
            row: 2, keys: [
                { code: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 0, wide: 'wide-18', special: true },
                { code: 'KeyA', normal: 'అ', shift: 'ఆ', finger: 0 },
                { code: 'KeyS', normal: 'ఇ', shift: 'ఈ', finger: 0 },
                { code: 'KeyD', normal: 'ఉ', shift: 'ఊ', finger: 1 },
                { code: 'KeyF', normal: 'ఋ', shift: 'ఋ', finger: 2 },
                { code: 'KeyG', normal: 'ఎ', shift: 'ఎ', finger: 3 },
                { code: 'KeyH', normal: 'ఏ', shift: 'ఏ', finger: 3 },
                { code: 'KeyJ', normal: 'ఐ', shift: 'ఐ', finger: 3 },
                { code: 'KeyK', normal: 'ఒ', shift: 'ఒ', finger: 2 },
                { code: 'KeyL', normal: 'ఓ', shift: ':', finger: 1 },
                { code: 'Semicolon', normal: 'ఔ', shift: ';', finger: 0 },
                { code: 'Quote', normal: 'య', shift: "'", finger: 0 },
                { code: 'Enter', normal: '↵ Enter', shift: '↵', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 3, keys: [
                { code: 'ShiftLeft', normal: '⇧ Shift', shift: '⇧', finger: 0, wide: 'wide-22', special: true },
                { code: 'KeyZ', normal: 'ఋ', shift: 'ఋ', finger: 0 },
                { code: 'KeyX', normal: 'ౠ', shift: 'ౠ', finger: 1 },
                { code: 'KeyC', normal: 'ఔ', shift: 'ఔ', finger: 2 },
                { code: 'KeyV', normal: 'వ', shift: 'వ', finger: 3 },
                { code: 'KeyB', normal: 'శ', shift: 'శ', finger: 3 },
                { code: 'KeyN', normal: 'ష', shift: 'ష', finger: 3 },
                { code: 'KeyM', normal: 'స', shift: 'స', finger: 2 },
                { code: 'Comma', normal: ',', shift: '<', finger: 1 },
                { code: 'Period', normal: '.', shift: '>', finger: 0 },
                { code: 'Slash', normal: 'హ', shift: '/', finger: 0 },
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
        fonts: ['Noto Sans Telugu', 'Noto Serif Telugu'],
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
