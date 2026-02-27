// lang/ta/spec.js — Tamil language spec for the typing app
// Exposes `window.LANG_SPEC` with all Tamil-specific mappings so the app can be configured per-language.

window.LANG_SPEC = {
    id: 'ta',
    segmenterLocale: 'ta',
    CONS_RANGE: { lo: 0x0B95, hi: 0x0BB9 },
    VOW_RANGE: { lo: 0x0B85, hi: 0x0B94 },
    VIRAMA: '\u0BCD',
    VOWEL_TO_MATRA: {
        'அ': null,
        'ஆ': '\u0BBE',
        'இ': '\u0BBF',
        'ஈ': '\u0BC0',
        'உ': '\u0BC1',
        'ஊ': '\u0BC2',
        'எ': '\u0BC6',
        'ஏ': '\u0BC7',
        'ஐ': '\u0BC8',
        'ஒ': '\u0BCA',
        'ஓ': '\u0BCB',
        'ஔ': '\u0BCC',
    },
    // NOTE: `KEY_MAP` will be generated from `TAM99_LAYOUT` below to
    // avoid duplicate maintenance of the same mapping in two places.

    // TAM99 layout rows (used to render virtual keyboard and build CHAR_KEY_MAP if needed)
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
                { code: 'KeyQ', normal: 'ஆ', shift: 'சு', finger: 0 },
                { code: 'KeyW', normal: 'ஈ', shift: 'ஷி', finger: 0 },
                { code: 'KeyE', normal: 'ஊ', shift: 'ஜ', finger: 1 },
                { code: 'KeyR', normal: 'ஐ', shift: 'ஹ', finger: 2 },
                { code: 'KeyT', normal: 'ஏ', shift: 'க்ஷ', finger: 3 },
                { code: 'KeyY', normal: 'ள', shift: 'ஶ்ரீ', finger: 3 },
                { code: 'KeyU', normal: 'ற', shift: 'ஶ', finger: 3 },
                { code: 'KeyI', normal: 'ன', shift: '', finger: 2 },
                { code: 'KeyO', normal: 'ட', shift: '[', finger: 1 },
                { code: 'KeyP', normal: 'ண', shift: ']', finger: 0 },
                { code: 'BracketLeft', normal: 'ச', shift: '{', finger: 0 },
                { code: 'BracketRight', normal: 'ஞ', shift: '}', finger: 0 },
                { code: 'Backslash', normal: '\\', shift: '|', finger: 0, wide: 'wide-15' },
            ]
        },
        {
            row: 2, keys: [
                { code: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 0, wide: 'wide-18', special: true },
                { code: 'KeyA', normal: 'அ', shift: '௹', finger: 0 },
                { code: 'KeyS', normal: 'இ', shift: '௺', finger: 0 },
                { code: 'KeyD', normal: 'உ', shift: '௸', finger: 1 },
                { code: 'KeyF', normal: 'ஃ', shift: '', finger: 2 },
                { code: 'KeyG', normal: 'எ', shift: '', finger: 3 },
                { code: 'KeyH', normal: 'க', shift: '', finger: 3 },
                { code: 'KeyJ', normal: 'ப', shift: '', finger: 3 },
                { code: 'KeyK', normal: 'ம', shift: '"', finger: 2 },
                { code: 'KeyL', normal: 'த', shift: ':', finger: 1 },
                { code: 'Semicolon', normal: 'ந', shift: ';', finger: 0 },
                { code: 'Quote', normal: 'ய', shift: "'", finger: 0 },
                { code: 'Enter', normal: '↵ Enter', shift: '↵', finger: 0, wide: 'wide-22', special: true },
            ]
        },
        {
            row: 3, keys: [
                { code: 'ShiftLeft', normal: '⇧ Shift', shift: '⇧', finger: 0, wide: 'wide-22', special: true },
                { code: 'KeyZ', normal: 'ஓள', shift: '௳', finger: 0 },
                { code: 'KeyX', normal: 'ஓ', shift: '௴', finger: 0 },
                { code: 'KeyC', normal: 'ஒ', shift: '௵', finger: 1 },
                { code: 'KeyV', normal: 'வ', shift: '௶', finger: 2 },
                { code: 'KeyB', normal: 'ங', shift: '௷', finger: 3 },
                { code: 'KeyN', normal: 'ல', shift: 'ௐ', finger: 3 },
                { code: 'KeyM', normal: 'ர', shift: '/', finger: 3 },
                { code: 'Comma', normal: ',', shift: '<', finger: 2 },
                { code: 'Period', normal: '.', shift: '>', finger: 1 },
                { code: 'Slash', normal: 'ழ', shift: '/', finger: 0 },
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

    // Fonts/UI overrides (optional)
    UI: {
        fonts: ['Noto Sans Tamil', 'Noto Serif Tamil'],
        labels: {
            startPrompt: '⌨ Click here or start typing to begin',
        }
    }
};



// Generate `KEY_MAP` from `TAM99_LAYOUT` so the layout is the
// single source of truth. If an explicit `KEY_MAP` is already
// present (e.g., overridden elsewhere), do not clobber it.
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
