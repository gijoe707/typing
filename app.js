// app.js — main application logic, uses keymap.js and loads exercises.json dynamically

// ScriptEngine class (uses keymap globals which we'll attach after the class)
class ScriptEngine {
    constructor() {
        this._buffer = '';
        this._shiftActive = false;
        this._graphemes = [];
        this._cursor = 0;
    }

    loadText(text) {
        this._graphemes = ScriptEngine.segmentGraphemes(text);
        this._cursor = 0;
        this._buffer = '';
        return this._graphemes;
    }

    get graphemes() { return this._graphemes; }
    get cursor() { return this._cursor; }
    get bufferChar() { return this._buffer; }
    get isDone() { return this._cursor >= this._graphemes.length; }

    static segmentGraphemes(text) {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const locale = ScriptEngine.SEGMENTER_LOCALE || (window.LANG_SPEC && window.LANG_SPEC.segmenterLocale) || 'ta';
            const seg = new Intl.Segmenter(locale, { granularity: 'grapheme' });
            return [...seg.segment(text)].map(s => s.segment);
        }
        const MATRA_RANGE_LO = 0x0BBE;
        const MATRA_RANGE_HI = 0x0BCD;
        const clusters = [];
        let current = '';
        for (const ch of text) {
            const cp = ch.codePointAt(0);
            const isCombining = cp >= MATRA_RANGE_LO && cp <= MATRA_RANGE_HI;
            if (isCombining && current.length > 0) {
                current += ch;
            } else {
                if (current) clusters.push(current);
                current = ch;
            }
        }
        if (current) clusters.push(current);
        return clusters;
    }

    static isTamilConsonant(ch) {
        if (!ch) return false;
        const cp = ch.codePointAt(0);
        return cp >= ScriptEngine.TAMIL_CONS_LO && cp <= ScriptEngine.TAMIL_CONS_HI;
    }

    static isTamilVowel(ch) {
        if (!ch) return false;
        const cp = ch.codePointAt(0);
        return cp >= ScriptEngine.TAMIL_VOW_LO && cp <= ScriptEngine.TAMIL_VOW_HI;
    }

    setShift(active) { this._shiftActive = active; }

    resolveKey(code) {
        const entry = ScriptEngine.KEY_MAP[code];
        if (!entry) return null;
        return this._shiftActive ? entry.s : entry.n;
    }

    handleKeyPress(code) {
        const result = {
            composedChar: '',
            isComplete: false,
            isCorrect: false,
            isError: false,
            wasBackspace: false,
            targetGrapheme: this._graphemes[this._cursor] ?? '',
            nextTargetGrapheme: this._graphemes[this._cursor + 1] ?? '',
            bufferPreview: this._buffer,
            cursorAdvanced: false,
        };

        if (code === 'Backspace') {
            result.wasBackspace = true;
            if (this._buffer) this._buffer = '';
            else if (this._cursor > 0) this._cursor--;
            result.bufferPreview = this._buffer;
            result.targetGrapheme = this._graphemes[this._cursor] ?? '';
            result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
            return result;
        }

        if (code === 'ShiftLeft' || code === 'ShiftRight' ||
            code === 'ControlLeft' || code === 'ControlRight' ||
            code === 'AltLeft' || code === 'AltRight' ||
            code === 'CapsLock' || code === 'Tab' || code === 'Enter') {
            return result;
        }

        if (this.isDone) return result;

        const rawChar = this.resolveKey(code);
        if (rawChar === null) return result;

        const target = this._graphemes[this._cursor];

        if (code === 'Space') {
            this._buffer = '';
            result.composedChar = ' ';
            result.isComplete = true;
            result.isCorrect = ' '.normalize('NFC') === target.normalize('NFC');
            result.isError = !result.isCorrect;
            if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
            result.bufferPreview = '';
            result.targetGrapheme = this._graphemes[this._cursor] ?? '';
            result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
            return result;
        }

        if (ScriptEngine.isTamilConsonant(rawChar)) {
            const targetNFC = target.normalize('NFC');
            const targetBase = [...targetNFC][0];
            if (targetBase === rawChar && targetNFC.length > 1) {
                this._buffer = rawChar;
                result.isComplete = false;
                result.bufferPreview = this._buffer;
                result.targetGrapheme = targetNFC;
                result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
                return result;
            }
            this._buffer = '';
            const composed = rawChar.normalize('NFC');
            result.composedChar = composed;
            result.isComplete = true;
            result.isCorrect = composed === targetNFC;
            result.isError = !result.isCorrect;
            if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
            result.bufferPreview = '';
            result.targetGrapheme = this._graphemes[this._cursor] ?? '';
            result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
            return result;
        }

        if (ScriptEngine.isTamilVowel(rawChar)) {
            let composed;
            if (this._buffer) {
                const matra = ScriptEngine.VOWEL_TO_MATRA[rawChar];
                composed = matra ? (this._buffer + matra).normalize('NFC') : this._buffer.normalize('NFC');
                this._buffer = '';
            } else {
                composed = rawChar.normalize('NFC');
            }
            result.composedChar = composed;
            result.isComplete = true;
            result.isCorrect = composed === target.normalize('NFC');
            result.isError = !result.isCorrect;
            if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
            result.bufferPreview = '';
            result.targetGrapheme = this._graphemes[this._cursor] ?? '';
            result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
            return result;
        }

        if (rawChar === 'ஃ') {
            if (this._buffer) {
                const pulliForm = (this._buffer + ScriptEngine.VIRAMA).normalize('NFC');
                result.composedChar = pulliForm;
                result.isComplete = true;
                result.isCorrect = pulliForm === target.normalize('NFC');
                result.isError = !result.isCorrect;
                if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
                this._buffer = '';
            } else {
                result.composedChar = 'ஃ'.normalize('NFC');
                result.isComplete = true;
                result.isCorrect = result.composedChar === target.normalize('NFC');
                result.isError = !result.isCorrect;
                if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
            }
            result.bufferPreview = this._buffer;
            result.targetGrapheme = this._graphemes[this._cursor] ?? '';
            result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
            return result;
        }

        if (rawChar.length > 1 || (rawChar.codePointAt(0) && !ScriptEngine.isTamilConsonant(rawChar) && !ScriptEngine.isTamilVowel(rawChar))) {
            if (this._buffer) this._buffer = '';
            const composed = rawChar.normalize('NFC');
            result.composedChar = composed;
            result.isComplete = true;
            result.isCorrect = composed === target.normalize('NFC');
            result.isError = !result.isCorrect;
            if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
            result.bufferPreview = '';
            result.targetGrapheme = this._graphemes[this._cursor] ?? '';
            result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
            return result;
        }

        this._buffer = '';
        const composed = rawChar.normalize('NFC');
        result.composedChar = composed;
        result.isComplete = true;
        result.isCorrect = composed === target.normalize('NFC');
        result.isError = !result.isCorrect;
        if (result.isCorrect) { this._cursor++; result.cursorAdvanced = true; }
        result.bufferPreview = '';
        result.targetGrapheme = this._graphemes[this._cursor] ?? '';
        result.nextTargetGrapheme = this._graphemes[this._cursor + 1] ?? '';
        return result;
    }

    reset() { this._buffer = ''; this._cursor = 0; this._graphemes = []; }

    getKeySequenceFor(grapheme) {
        if (!grapheme) return [];
        const nfc = grapheme.normalize('NFC');
        if (nfc === ' ') return ['Space'];
        // Prefer an unshifted key match if available; otherwise use shifted match.
        let shiftedMatch = null;
        for (const [code, { n, s }] of Object.entries(ScriptEngine.KEY_MAP || {})) {
            if (n && n.normalize('NFC') === nfc) return [code];
            if (s && s.normalize('NFC') === nfc) shiftedMatch = code;
        }
        if (shiftedMatch) return ['ShiftLeft', shiftedMatch];
        const baseChar = [...nfc][0];
        const rest = nfc.slice(baseChar.length > 1 ? 2 : 1);
        if (ScriptEngine.isTamilConsonant(baseChar)) {
            let consKey = null, needShift = false;
            for (const [code, { n, s }] of Object.entries(ScriptEngine.KEY_MAP)) {
                if (n === baseChar) { consKey = code; needShift = false; break; }
                if (s === baseChar) { consKey = code; needShift = true; break; }
            }
            if (!consKey) return [];
            const seq = needShift ? ['ShiftLeft', consKey] : [consKey];
            if (!rest) return seq;
            const firstRest = rest[0];
            const restCp = firstRest.codePointAt(0);
            if (restCp === 0x0BCD) return [...seq, 'KeyF'];
            // Map vowel letters to key codes (prefer unshifted), then resolve matra -> key.
            const vowels = Object.keys(ScriptEngine.VOWEL_TO_MATRA || {});
            const vowelToKey = {};
            for (const [code, { n, s }] of Object.entries(ScriptEngine.KEY_MAP || {})) {
                if (n && vowels.includes(n)) vowelToKey[n] = vowelToKey[n] || code;
                if (s && vowels.includes(s) && !vowelToKey[s]) vowelToKey[s] = code;
            }
            const matra = firstRest; // e.g. '\u0BCA'
            let vowelKey = null;
            for (const vowel of vowels) {
                if ((ScriptEngine.VOWEL_TO_MATRA[vowel] || '') === matra) {
                    vowelKey = vowelToKey[vowel] || null;
                    break;
                }
            }
            // Fallback: search KEY_MAP for an entry whose vowel maps to this matra (unshifted preferred)
            if (!vowelKey) {
                for (const [code, { n, s }] of Object.entries(ScriptEngine.KEY_MAP || {})) {
                    const nMatra = (ScriptEngine.VOWEL_TO_MATRA && ScriptEngine.VOWEL_TO_MATRA[n]) || null;
                    const sMatra = (ScriptEngine.VOWEL_TO_MATRA && ScriptEngine.VOWEL_TO_MATRA[s]) || null;
                    if (nMatra === matra) { vowelKey = code; break; }
                    if (sMatra === matra) { vowelKey = code; /* continue searching to prefer unshifted */ }
                }
            }
            return vowelKey ? [...seq, vowelKey] : seq;
        }
        return [];
    }
}

// Attach static maps/constants from language spec or existing keymap globals
const LANG = window.LANG_SPEC || {};
ScriptEngine.KEY_MAP = LANG.KEY_MAP || window.KEY_MAP;
ScriptEngine.VOWEL_TO_MATRA = LANG.VOWEL_TO_MATRA || window.VOWEL_TO_MATRA;
ScriptEngine.VIRAMA = LANG.VIRAMA || window.VIRAMA;
ScriptEngine.TAMIL_CONS_LO = (LANG.CONS_RANGE && LANG.CONS_RANGE.lo) || window.TAMIL_CONS_LO;
ScriptEngine.TAMIL_CONS_HI = (LANG.CONS_RANGE && LANG.CONS_RANGE.hi) || window.TAMIL_CONS_HI;
ScriptEngine.TAMIL_VOW_LO = (LANG.VOW_RANGE && LANG.VOW_RANGE.lo) || window.TAMIL_VOW_LO;
ScriptEngine.TAMIL_VOW_HI = (LANG.VOW_RANGE && LANG.VOW_RANGE.hi) || window.TAMIL_VOW_HI;

// Use TAM99_LAYOUT, CHAR_KEY_MAP, FINGER_* from language spec or keymap.js
let TAM99_LAYOUT = LANG.TAM99_LAYOUT || window.TAM99_LAYOUT || [];
let CHAR_KEY_MAP = LANG.CHAR_KEY_MAP || window.CHAR_KEY_MAP || {};
let FINGER_NAMES = LANG.FINGER_NAMES || window.FINGER_NAMES || ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];
let FINGER_COLORS = LANG.FINGER_COLORS || window.FINGER_COLORS || ['var(--pinky)', 'var(--ring)', 'var(--middle)', 'var(--index)', 'var(--thumb)'];
let FINGER_CLASSES = LANG.FINGER_CLASSES || window.FINGER_CLASSES || ['finger-pinky', 'finger-ring', 'finger-middle', 'finger-index', 'finger-thumb'];

// If the CHAR_KEY_MAP is missing, build it from TAM99_LAYOUT
if ((!CHAR_KEY_MAP || Object.keys(CHAR_KEY_MAP).length === 0) && TAM99_LAYOUT && TAM99_LAYOUT.length) {
    CHAR_KEY_MAP = {};
    TAM99_LAYOUT.forEach(row => {
        (row.keys || []).forEach(key => {
            if (key.normal && key.normal.length >= 1 && key.normal.length <= 8 && !key.special) {
                CHAR_KEY_MAP[key.normal] = { code: key.code, shift: false, finger: key.finger };
            }
            if (key.shift && key.shift.length >= 1 && key.shift.length <= 8 && !key.special) {
                CHAR_KEY_MAP[key.shift] = { code: key.code, shift: true, finger: key.finger };
            }
        });
    });
    CHAR_KEY_MAP[' '] = { code: 'Space', shift: false, finger: 4 };
}

// App state
let levels = [];
let currentLevel = null;
let currentText = '';
let typedIndex = 0;
let errors = 0;
let startTime = null;
let timerInterval = null;
let isStarted = false;
let isShiftHeld = false;
let totalKeystrokes = 0;
let errorSet = new Set();

// Language configuration
let currentLanguage = localStorage.getItem('selectedLanguage') || 'ta';
const LANGUAGE_CONFIG = {
    ta: {
        name: 'Tamil',
        nativeName: 'தமிழ்',
        specPath: 'lang/ta/spec.js',
        exercisesPath: 'lang/ta/exercises.js',
        appTitle: 'தமிழ் தட்டச்சு பயிற்சி',
        appSubtitle: 'Tamil 99 Typing Tutor',
        logoChar: 'த',
        levelsLabel: 'பாடங்கள் / Levels',
        typeLabel: 'தட்டச்சு / Type',
        levelsViewTitle: 'பாட நிலைகள்',
        levelsViewSubtitle: 'CHOOSE YOUR LESSON · 25 LEVELS ACROSS 4 PHASES',
        backButtonLabel: '← பாடங்கள்',
    },
    ml: {
        name: 'Malayalam',
        nativeName: 'മലയാളം',
        specPath: 'lang/ml/spec.js',
        exercisesPath: 'lang/ml/exercises.js',
        appTitle: 'മലയാളം ടൈപ്പിംഗ് പരിശീലനം',
        appSubtitle: 'Malayalam Typing Tutor',
        logoChar: 'മ',
        levelsLabel: 'പാഠങ്ങള്‍ / Lessons',
        typeLabel: 'ടൈപ്പ് / Type',
        levelsViewTitle: 'പാഠ നിലകൾ',
        levelsViewSubtitle: 'നിങ്ങളുടെ പാഠം തിരഞ്ഞെടുക്കുക · 4 PHASES വിലെ 25 LEVELS',
        backButtonLabel: '← പാഠങ്ങള്‍',
    }
};

// Load available language codes from lang/languages.json and merge
// defaults into LANGUAGE_CONFIG for any discovered languages.
async function loadAvailableLanguages() {
    // First try an inline JSON manifest (works with file://)
    try {
        const inline = document.getElementById('languages-manifest');
        if (inline) {
            const manifest = JSON.parse(inline.textContent || '[]');
            if (Array.isArray(manifest)) {
                // Manifest may be array of codes or array of objects
                if (manifest.length === 0) return;
                if (typeof manifest[0] === 'string') {
                    manifest.forEach(code => {
                        if (LANGUAGE_CONFIG[code]) return;
                        LANGUAGE_CONFIG[code] = {
                            name: code.toUpperCase(),
                            nativeName: code,
                            specPath: `lang/${code}/spec.js`,
                            exercisesPath: `lang/${code}/exercises.js`,
                            appTitle: code,
                            appSubtitle: '',
                            logoChar: code.charAt(0).toUpperCase(),
                            levelsLabel: 'Levels',
                            typeLabel: 'Type',
                            levelsViewTitle: 'Levels',
                            levelsViewSubtitle: '',
                            backButtonLabel: '← Levels'
                        };
                    });
                    return;
                }
                // array of objects with metadata
                manifest.forEach(entry => {
                    const code = entry.code;
                    if (!code) return;
                    LANGUAGE_CONFIG[code] = LANGUAGE_CONFIG[code] || {};
                    // Merge provided fields, keep defaults for missing
                    Object.assign(LANGUAGE_CONFIG[code], {
                        name: entry.name || LANGUAGE_CONFIG[code].name || code.toUpperCase(),
                        nativeName: entry.nativeName || LANGUAGE_CONFIG[code].nativeName || entry.name || code,
                        specPath: entry.specPath || LANGUAGE_CONFIG[code].specPath || `lang/${code}/spec.js`,
                        exercisesPath: entry.exercisesPath || LANGUAGE_CONFIG[code].exercisesPath || `lang/${code}/exercises.js`,
                        appTitle: entry.appTitle || LANGUAGE_CONFIG[code].appTitle || entry.name || code,
                        appSubtitle: entry.appSubtitle || LANGUAGE_CONFIG[code].appSubtitle || '',
                        logoChar: entry.logoChar || LANGUAGE_CONFIG[code].logoChar || (entry.name ? entry.name.charAt(0) : code.charAt(0)),
                        levelsLabel: entry.levelsLabel || LANGUAGE_CONFIG[code].levelsLabel || 'Levels',
                        typeLabel: entry.typeLabel || LANGUAGE_CONFIG[code].typeLabel || 'Type',
                        levelsViewTitle: entry.levelsViewTitle || LANGUAGE_CONFIG[code].levelsViewTitle || 'Levels',
                        levelsViewSubtitle: entry.levelsViewSubtitle || LANGUAGE_CONFIG[code].levelsViewSubtitle || '',
                        backButtonLabel: entry.backButtonLabel || LANGUAGE_CONFIG[code].backButtonLabel || '← Levels'
                    });
                });
                return;
            }
        }
    } catch (e) {
        console.warn('Failed to parse inline languages manifest', e);
    }

    // Fallback to fetching the manifest over HTTP(S)
    try {
        const res = await fetch('lang/languages.json');
        if (!res.ok) return;
        const manifest = await res.json();
        if (!Array.isArray(manifest)) return;
        if (manifest.length === 0) return;
        if (typeof manifest[0] === 'string') {
            manifest.forEach(code => {
                if (LANGUAGE_CONFIG[code]) return; // already present
                LANGUAGE_CONFIG[code] = {
                    name: code.toUpperCase(),
                    nativeName: code,
                    specPath: `lang/${code}/spec.js`,
                    exercisesPath: `lang/${code}/exercises.js`,
                    appTitle: code,
                    appSubtitle: '',
                    logoChar: code.charAt(0).toUpperCase(),
                    levelsLabel: 'Levels',
                    typeLabel: 'Type',
                    levelsViewTitle: 'Levels',
                    levelsViewSubtitle: '',
                    backButtonLabel: '← Levels'
                };
            });
        } else {
            // array of objects with metadata
            manifest.forEach(entry => {
                const code = entry.code;
                if (!code) return;
                LANGUAGE_CONFIG[code] = LANGUAGE_CONFIG[code] || {};
                Object.assign(LANGUAGE_CONFIG[code], {
                    name: entry.name || LANGUAGE_CONFIG[code].name || code.toUpperCase(),
                    nativeName: entry.nativeName || LANGUAGE_CONFIG[code].nativeName || entry.name || code,
                    specPath: entry.specPath || LANGUAGE_CONFIG[code].specPath || `lang/${code}/spec.js`,
                    exercisesPath: entry.exercisesPath || LANGUAGE_CONFIG[code].exercisesPath || `lang/${code}/exercises.js`,
                    appTitle: entry.appTitle || LANGUAGE_CONFIG[code].appTitle || entry.name || code,
                    appSubtitle: entry.appSubtitle || LANGUAGE_CONFIG[code].appSubtitle || '',
                    logoChar: entry.logoChar || LANGUAGE_CONFIG[code].logoChar || (entry.name ? entry.name.charAt(0) : code.charAt(0)),
                    levelsLabel: entry.levelsLabel || LANGUAGE_CONFIG[code].levelsLabel || 'Levels',
                    typeLabel: entry.typeLabel || LANGUAGE_CONFIG[code].typeLabel || 'Type',
                    levelsViewTitle: entry.levelsViewTitle || LANGUAGE_CONFIG[code].levelsViewTitle || 'Levels',
                    levelsViewSubtitle: entry.levelsViewSubtitle || LANGUAGE_CONFIG[code].levelsViewSubtitle || '',
                    backButtonLabel: entry.backButtonLabel || LANGUAGE_CONFIG[code].backButtonLabel || '← Levels'
                });
            });
        }
    } catch (e) {
        console.warn('Could not load lang/languages.json', e);
    }
}

function populateLanguageSelector() {
    const sel = document.getElementById('language-selector');
    if (!sel) return;
    sel.innerHTML = '';
    Object.keys(LANGUAGE_CONFIG).forEach(code => {
        const cfg = LANGUAGE_CONFIG[code];
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = `${cfg.nativeName || cfg.name} / ${cfg.name}`;
        sel.appendChild(opt);
    });
}

// ScriptEngine instance
const engine = new ScriptEngine();

// Language switching function
async function changeLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem('selectedLanguage', langCode);

    // Update UI text
    const config = LANGUAGE_CONFIG[langCode];
    document.getElementById('app-title').textContent = config.appTitle;
    document.getElementById('app-subtitle').textContent = config.appSubtitle;
    document.getElementById('logo-icon').textContent = config.logoChar;
    document.getElementById('nav-levels').textContent = config.levelsLabel;
    document.getElementById('nav-type').textContent = config.typeLabel;
    const sideTitleEl = document.getElementById('side-nav-title');
    if (sideTitleEl) sideTitleEl.textContent = config.levelsLabel;
    const backBtnEl = document.getElementById('back-btn');
    if (backBtnEl) backBtnEl.textContent = config.backButtonLabel;
    document.getElementById('language-selector').value = langCode;
    document.documentElement.lang = langCode;

    // Update levels view header
    const levelViewHeader = document.querySelector('.levels-header h2');
    const levelViewSubtitle = document.querySelector('.levels-header p');
    if (levelViewHeader) levelViewHeader.textContent = config.levelsViewTitle;
    if (levelViewSubtitle) levelViewSubtitle.textContent = config.levelsViewSubtitle;

    // Clear previous language spec and exercises
    window.LANG_SPEC = null;
    window.EXERCISES = [];

    // Load new language spec and exercises dynamically
    await loadLanguageSpec(langCode);
    await loadLevels();

    // Reset UI state
    showView('levels');
    renderLevels();
    buildKeyboard();

    // Reset typing state if a level was in progress
    if (currentLevel) {
        resetTypingState();
    }
}

async function loadLanguageSpec(langCode) {
    const config = LANGUAGE_CONFIG[langCode];
    // Load the language spec first, then the exercises script. Resolve only after both loaded.
    return new Promise((resolve, reject) => {
        const specScript = document.createElement('script');
        specScript.src = config.specPath;
        specScript.onload = () => {
            // Reattach ScriptEngine constants from the newly loaded LANG_SPEC
            if (window.LANG_SPEC) {
                ScriptEngine.KEY_MAP = window.LANG_SPEC.KEY_MAP;
                ScriptEngine.VOWEL_TO_MATRA = window.LANG_SPEC.VOWEL_TO_MATRA;
                ScriptEngine.VIRAMA = window.LANG_SPEC.VIRAMA;
                ScriptEngine.SEGMENTER_LOCALE = window.LANG_SPEC.segmenterLocale || langCode;
                ScriptEngine.TAMIL_CONS_LO = (window.LANG_SPEC.CONS_RANGE && window.LANG_SPEC.CONS_RANGE.lo) || 0x0B95;
                ScriptEngine.TAMIL_CONS_HI = (window.LANG_SPEC.CONS_RANGE && window.LANG_SPEC.CONS_RANGE.hi) || 0x0BB9;
                ScriptEngine.TAMIL_VOW_LO = (window.LANG_SPEC.VOW_RANGE && window.LANG_SPEC.VOW_RANGE.lo) || 0x0B85;
                ScriptEngine.TAMIL_VOW_HI = (window.LANG_SPEC.VOW_RANGE && window.LANG_SPEC.VOW_RANGE.hi) || 0x0B94;
            }

            // Update global keyboard layout references
            if (window.LANG_SPEC) {
                window.TAM99_LAYOUT = window.LANG_SPEC.TAM99_LAYOUT || [];
                window.CHAR_KEY_MAP = {};
                (window.TAM99_LAYOUT || []).forEach(row => {
                    (row.keys || []).forEach(key => {
                        if (key.normal && key.normal.length >= 1 && key.normal.length <= 8 && !key.special) {
                            window.CHAR_KEY_MAP[key.normal] = { code: key.code, shift: false, finger: key.finger };
                        }
                        if (key.shift && key.shift.length >= 1 && key.shift.length <= 8 && !key.special) {
                            window.CHAR_KEY_MAP[key.shift] = { code: key.code, shift: true, finger: key.finger };
                        }
                    });
                });
                window.CHAR_KEY_MAP[' '] = { code: 'Space', shift: false, finger: 4 };

                window.FINGER_NAMES = window.LANG_SPEC.FINGER_NAMES || ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];
                window.FINGER_COLORS = window.LANG_SPEC.FINGER_COLORS || ['var(--pinky)', 'var(--ring)', 'var(--middle)', 'var(--index)', 'var(--thumb)'];
                window.FINGER_CLASSES = window.LANG_SPEC.FINGER_CLASSES || ['finger-pinky', 'finger-ring', 'finger-middle', 'finger-index', 'finger-thumb'];
                // Update local references used by the app so keyboard rebuilds use the new spec
                TAM99_LAYOUT = window.TAM99_LAYOUT || [];
                CHAR_KEY_MAP = window.CHAR_KEY_MAP || {};
                FINGER_NAMES = window.FINGER_NAMES;
                FINGER_COLORS = window.FINGER_COLORS;
                FINGER_CLASSES = window.FINGER_CLASSES;
            }

            // Now load exercises script and wait for it too
            const exercisesScript = document.createElement('script');
            exercisesScript.src = config.exercisesPath;
            exercisesScript.onload = () => {
                resolve();
            };
            exercisesScript.onerror = (err) => { console.error('Failed to load exercises script', err); resolve(); };
            document.head.appendChild(exercisesScript);
        };
        specScript.onerror = (err) => { console.error('Failed to load language spec', err); reject(err); };
        document.head.appendChild(specScript);
    });
}

async function init() {
    // Load available languages and populate selector
    await loadAvailableLanguages();
    populateLanguageSelector();
    // Ensure selected language is valid
    if (!LANGUAGE_CONFIG[currentLanguage]) currentLanguage = Object.keys(LANGUAGE_CONFIG)[0] || currentLanguage;
    document.getElementById('language-selector').value = currentLanguage;

    // Load the current language spec
    await loadLanguageSpec(currentLanguage);

    // Update UI with current language config
    const config = LANGUAGE_CONFIG[currentLanguage];
    document.getElementById('app-title').textContent = config.appTitle;
    document.getElementById('app-subtitle').textContent = config.appSubtitle;
    document.getElementById('logo-icon').textContent = config.logoChar;
    document.getElementById('nav-levels').textContent = config.levelsLabel;
    document.getElementById('nav-type').textContent = config.typeLabel;
    const sideTitleEl2 = document.getElementById('side-nav-title');
    if (sideTitleEl2) sideTitleEl2.textContent = config.levelsLabel;
    const backBtnEl2 = document.getElementById('back-btn');
    if (backBtnEl2) backBtnEl2.textContent = config.backButtonLabel;
    document.documentElement.lang = currentLanguage;

    // Update levels view header
    const levelViewHeader = document.querySelector('.levels-header h2');
    const levelViewSubtitle = document.querySelector('.levels-header p');
    if (levelViewHeader) levelViewHeader.textContent = config.levelsViewTitle;
    if (levelViewSubtitle) levelViewSubtitle.textContent = config.levelsViewSubtitle;

    await loadLevels();
    buildKeyboard();
    renderLevels();
    setupInputHandlers();
    setupKeyboardToggle();
}

async function loadLevels() {
    // Prefer a preloaded `window.EXERCISES` (works with file:// browsers)
    if (window.EXERCISES && Array.isArray(window.EXERCISES) && window.EXERCISES.length) {
        levels = window.EXERCISES;
        return;
    }

    // Otherwise try to fetch JSON (works when served over http(s))
    try {
        const res = await fetch('exercises.json');
        if (!res.ok) throw new Error('Failed to load exercises.json');
        levels = await res.json();
    } catch (e) {
        console.error('Could not fetch exercises.json, falling back to empty levels', e);
        levels = [];
    }
}

function showView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + name).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-' + name)?.classList.add('active');
    if (name === 'levels') {
        stopTimer();
        renderLevels();
    }
}

function getProgress(levelId) {
    const key = `ttt_level_${currentLanguage || 'ta'}_${levelId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
}

function saveProgress(levelId, data) {
    const existing = getProgress(levelId) || {};
    const merged = { ...existing, ...data };
    if (data.stars !== undefined && (existing.stars === undefined || data.stars > existing.stars)) {
        merged.stars = data.stars;
    }
    if (data.wpm !== undefined && (existing.wpm === undefined || data.wpm > existing.wpm)) {
        merged.bestWPM = data.wpm;
    }
    const key = `ttt_level_${currentLanguage || 'ta'}_${levelId}`;
    localStorage.setItem(key, JSON.stringify(merged));
}

function renderLevels() {
    const container = document.getElementById('levels-container');
    const phases = {
        1: { label: 'Phase 1 — Home Row', cls: 'phase-1', badge: 'Beginner' },
        2: { label: 'Phase 2 — Full Keyboard', cls: 'phase-2', badge: 'Intermediate' },
        3: { label: 'Phase 3 — Literature', cls: 'phase-3', badge: 'Advanced' },
        4: { label: 'Bonus — Tamil Numerals', cls: 'phase-4', badge: 'Bonus' },
    };

    let html = '';
    let lastPhase = null;

    levels.forEach(level => {
        if (level.phase !== lastPhase) {
            if (lastPhase !== null) html += '</div></div>';
            const ph = phases[level.phase];
            html += `<div class="phase-group ${ph.cls}">
        <div class="phase-label"><span class="phase-badge">${ph.badge}</span>${ph.label}</div>
        <div class="levels-grid">`;
            lastPhase = level.phase;
        }

        const prog = getProgress(level.id);
        const stars = prog?.stars || 0;
        const bestWPM = prog?.bestWPM || 0;
        const isCompleted = stars > 0;

        let starsHtml = '';
        for (let i = 1; i <= 5; i++) starsHtml += `<span class="star ${i <= stars ? 'filled' : 'empty'}">★</span>`;

        html += `<div class="level-card ${isCompleted ? 'completed' : ''}" onclick="startLevel(${level.id})">
      <div class="level-num">LEVEL ${level.id}</div>
      <div class="level-title">${level.title}</div>
      <div class="level-subtitle">${level.subtitle}</div>
      <div class="level-stars">${starsHtml}</div>
      <div class="level-wpm-badge">${bestWPM > 0 ? '⚡ ' + bestWPM + ' WPM' : '▸ ' + level.targetWPM + ' WPM'}</div>
    </div>`;
    });

    if (lastPhase !== null) html += '</div></div>';
    container.innerHTML = html;
}

function startLevel(id) {
    currentLevel = levels.find(l => l.id === id);
    if (!currentLevel) return;
    currentText = currentLevel.text;
    engine.loadText(currentText);
    resetTypingState();

    document.getElementById('current-level-title').textContent = currentLevel.title;
    document.getElementById('current-level-subtitle').textContent = currentLevel.subtitle;
    document.getElementById('level-indicator').textContent = `Level ${currentLevel.id} · Target: ${currentLevel.targetWPM} WPM`;

    renderTextDisplay();
    updateDashboard();
    updateFingerHint();
    highlightActiveKey();

    document.getElementById('nav-type').style.display = '';
    showView('typing');
    renderSideNav();
    setTimeout(() => { focusInput(); scrollSideNavToActive(); }, 100);
}

function resetTypingState() {
    typedIndex = 0; errors = 0; totalKeystrokes = 0; errorSet = new Set(); startTime = null; isStarted = false; stopTimer();
    if (currentLevel) engine.loadText(currentLevel.text);
    document.getElementById('start-prompt').style.display = '';
    document.getElementById('progress-bar').style.width = '0%';
}

function focusInput() { document.getElementById('start-prompt').style.display = 'none'; }

function renderTextDisplay() {
    const display = document.getElementById('text-display');
    const graphemes = engine.graphemes;
    let html = '';
    let wordBuffer = [];
    for (let i = 0; i < graphemes.length; i++) {
        const ch = graphemes[i];
        let cls = '';
        if (i < typedIndex) cls = errorSet.has(i) ? 'error' : 'correct';
        else if (i === typedIndex) cls = 'cursor';
        const escaped = ch === ' ' ? '&nbsp;' : ch.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        const span = `<span class="char ${cls}" id="char-${i}">${escaped}</span>`;
        if (ch === ' ') {
            // flush current word buffer as a non-breaking word
            if (wordBuffer.length) {
                html += `<span class="word">${wordBuffer.join('')}</span>`;
                wordBuffer = [];
            }
            // render the space itself
            html += span;
        } else {
            // collect graphemes that form a word
            wordBuffer.push(span);
        }
    }
    if (wordBuffer.length) html += `<span class="word">${wordBuffer.join('')}</span>`;
    display.innerHTML = html;
}

function updateChar(idx) {
    const el = document.getElementById('char-' + idx); if (!el) return;
    if (idx < typedIndex) el.className = 'char ' + (errorSet.has(idx) ? 'error' : 'correct');
    else if (idx === typedIndex) el.className = 'char cursor';
    else el.className = 'char';
}

function updateBufferGhost(bufChar) {
    const cursorEl = document.getElementById('char-' + typedIndex); if (!cursorEl) return;
    if (bufChar) { cursorEl.classList.add('buffering'); cursorEl.dataset.bufferChar = bufChar; }
    else { cursorEl.classList.remove('buffering'); delete cursorEl.dataset.bufferChar; }
}

function setupInputHandlers() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { isShiftHeld = true; engine.setShift(true); updateKeyboardShift(); return; }
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        if (!currentLevel) return;
        if (e.code !== 'Backspace') { if (e.key.length > 1 && e.key !== 'Space') return; }
        e.preventDefault();
        const keyEl = document.querySelector(`.key[data-code="${e.code}"]`);
        if (keyEl) { keyEl.style.transform = 'translateY(2px)'; keyEl.style.borderBottomWidth = '1px'; setTimeout(() => { keyEl.style.transform = ''; keyEl.style.borderBottomWidth = ''; }, 100); }
        const result = engine.handleKeyPress(e.code);
        handleEngineResult(result);
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { isShiftHeld = false; engine.setShift(false); updateKeyboardShift(); }
    });
}

function setupKeyboardToggle() {
    document.addEventListener('click', (e) => {
        if (e.target.id === 'keyboard-toggle-btn' || e.target.closest('#keyboard-toggle-btn')) {
            const keyboardWrapper = document.getElementById('keyboard-wrapper');
            const toggleText = document.getElementById('toggle-text');
            if (keyboardWrapper && toggleText) {
                keyboardWrapper.classList.toggle('hidden');
                toggleText.textContent = keyboardWrapper.classList.contains('hidden') ? 'Show' : 'Hide';
            }
        }
    }, { once: false });
}

function handleEngineResult(result) {
    if (!currentLevel) return;
    if (result.wasBackspace) {
        typedIndex = engine.cursor; updateBufferGhost(''); renderTextDisplay(); updateFingerHint(); highlightActiveKey(); updateDashboard(); return;
    }
    if (!result.isComplete) { updateBufferGhost(result.bufferPreview); highlightCompositionKeys(result.bufferPreview, result.targetGrapheme); return; }
    if (!isStarted) { isStarted = true; startTime = Date.now(); startTimer(); }
    totalKeystrokes++; updateBufferGhost('');
    if (result.isCorrect) {
        const prev = typedIndex; typedIndex = engine.cursor; updateChar(prev); updateChar(typedIndex);
        const total = engine.graphemes.length; const progress = (typedIndex / total) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
        document.getElementById('typing-wrapper').style.setProperty('--progress', progress / 100);
        updateFingerHint(); highlightActiveKey(); if (engine.isDone) { finishLevel(); return; }
    } else { errors++; errorSet.add(typedIndex); flashError(); }
    updateDashboard();
}

function highlightCompositionKeys(bufChar, targetGrapheme) {
    document.querySelectorAll('.key.active-key').forEach(k => {
        k.classList.remove('active-key');
        k.style.removeProperty('background');
        k.style.removeProperty('box-shadow');
        k.style.removeProperty('border-color');
    });
    if (!targetGrapheme) return;
    const seq = engine.getKeySequenceFor(targetGrapheme);
    const remaining = bufChar ? seq.slice(bufChar ? 1 : 0) : seq;
    remaining.forEach(code => {
        const el = document.querySelector(`.key[data-code="${code}"]`);
        if (!el) return;
        el.classList.add('active-key');
        const keyData = findKeyData(code);
        if (keyData && typeof keyData.finger === 'number') {
            const color = FINGER_COLORS[keyData.finger];
            if (color) {
                el.style.setProperty('background', color, 'important');
                el.style.setProperty('border-color', color, 'important');
                el.style.setProperty('box-shadow', `0 0 10px ${color}`, 'important');
            }
        }
    });
}

function flashError() {
    const wrapper = document.getElementById('typing-wrapper'); wrapper.classList.remove('shake', 'flash'); void wrapper.offsetWidth; wrapper.classList.add('shake', 'flash'); setTimeout(() => { wrapper.classList.remove('shake', 'flash'); }, 400);
}

function startTimer() { timerInterval = setInterval(updateDashboard, 500); }
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

function calcWPM() { if (!startTime || !isStarted) return 0; const elapsed = (Date.now() - startTime) / 60000; if (elapsed < 0.01) return 0; const words = typedIndex / 5; return Math.round(words / elapsed); }
function calcAccuracy() { if (totalKeystrokes === 0) return 100; return Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100); }

function updateDashboard() { document.getElementById('wpm-display').textContent = calcWPM(); document.getElementById('acc-display').textContent = calcAccuracy() + '%'; document.getElementById('err-display').textContent = errors; const total = engine.graphemes.length || currentText.length; document.getElementById('prog-display').textContent = typedIndex + ' / ' + total; }

function updateFingerHint() {
    if (engine.isDone) { document.getElementById('hint-char').textContent = '✓'; document.getElementById('hint-finger').textContent = 'Complete!'; return; }
    const target = engine.graphemes[typedIndex] ?? '';
    document.getElementById('hint-char').textContent = target === ' ' ? '⎵' : (target || '—');
    const seq = engine.getKeySequenceFor(target);
    const firstCode = seq.find(c => c !== 'ShiftLeft' && c !== 'ShiftRight') || '';
    if (target === ' ') { document.getElementById('hint-finger').textContent = 'Thumb'; document.getElementById('hint-dot').style.background = 'var(--thumb)'; return; }
    const keyData = findKeyData(firstCode);
    if (keyData) { const fi = keyData.finger; document.getElementById('hint-finger').textContent = FINGER_NAMES[fi]; document.getElementById('hint-dot').style.background = FINGER_COLORS[fi]; }
    else { document.getElementById('hint-finger').textContent = '—'; document.getElementById('hint-dot').style.background = 'var(--text-muted)'; }
}

function buildKeyboard() {
    const kb = document.getElementById('virtual-keyboard');
    if (!kb) { console.warn('buildKeyboard: #virtual-keyboard not found'); return; }
    let html = '';
    (TAM99_LAYOUT || []).forEach(row => {
        html += '<div class="kb-row">';
        row.keys.forEach(key => {
            const fingerCls = FINGER_CLASSES[key.finger] || '';
            const wideCls = key.wide || '';
            const specialCls = key.special ? 'special' : '';
            const escHtml = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const normal = escHtml(key.normal);
            const shift = escHtml(key.shift);
            // derive a small qwerty label (e.g. KeyQ -> q)
            const qwertyLabelFor = (code) => {
                if (!code) return '';
                if (code.startsWith('Key')) return code.slice(3).toLowerCase();
                if (code.startsWith('Digit')) return code.slice(5);
                const map = {
                    Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Semicolon: ';', Quote: "'",
                    Comma: ',', Period: '.', Slash: '/', Backslash: '\\', IntlBackslash: '\\', Backquote: '`'
                };
                return map[code] || '';
            };
            const qLabel = qwertyLabelFor(key.code || '');
            if (key.special) {
                html += `<div class="key ${fingerCls} ${wideCls} ${specialCls}" data-code="${key.code}"><span class="key-label">${normal}</span>${qLabel ? `<span class="key-qwerty">${qLabel}</span>` : ''}</div>`;
            } else {
                html += `<div class="key ${fingerCls} ${wideCls}" data-code="${key.code}"><span class="key-top">${shift}</span><span class="key-bottom">${normal}</span>${qLabel ? `<span class="key-qwerty">${qLabel}</span>` : ''}</div>`;
            }
        });
        html += '</div>';
    });
    kb.innerHTML = html;
}

function highlightActiveKey() {
    document.querySelectorAll('.key.active-key').forEach(k => {
        k.classList.remove('active-key');
        k.style.removeProperty('background');
        k.style.removeProperty('box-shadow');
        k.style.removeProperty('border-color');
    });
    if (!currentLevel || engine.isDone) return;
    const target = engine.graphemes[typedIndex] ?? '';
    if (!target) return;
    const seq = engine.getKeySequenceFor(target);
    const bufLen = engine.bufferChar ? 1 : 0;
    const toHighlight = bufLen > 0 ? seq.slice(1) : seq;
    toHighlight.forEach(code => {
        const el = document.querySelector(`.key[data-code="${code}"]`);
        if (!el) return;
        el.classList.add('active-key');
        const keyData = findKeyData(code);
        if (keyData && typeof keyData.finger === 'number') {
            const color = FINGER_COLORS[keyData.finger];
            if (color) {
                el.style.setProperty('background', color, 'important');
                el.style.setProperty('border-color', color, 'important');
                el.style.setProperty('box-shadow', `0 0 10px ${color}`, 'important');
            }
        }
    });
}

function updateKeyboardShift() {
    document.querySelectorAll('.key:not(.special)').forEach(keyEl => {
        const code = keyEl.dataset.code; const keyData = findKeyData(code); if (!keyData) return;
        const bottomEl = keyEl.querySelector('.key-bottom'); const topEl = keyEl.querySelector('.key-top');
        if (isShiftHeld) { keyEl.classList.add('shift-held'); if (bottomEl) bottomEl.textContent = keyData.shift || ''; if (topEl) topEl.textContent = keyData.normal || ''; }
        else { keyEl.classList.remove('shift-held'); if (bottomEl) bottomEl.textContent = keyData.normal || ''; if (topEl) topEl.textContent = keyData.shift || ''; }
    });
    highlightActiveKey();
}

function findKeyData(code) { for (const row of TAM99_LAYOUT) for (const key of row.keys) if (key.code === code) return key; return null; }

function finishLevel() {
    stopTimer(); const wpm = calcWPM(); const acc = calcAccuracy();
    let stars = 1; const target = currentLevel.targetWPM;
    if (acc >= 95 && wpm >= target * 1.3) stars = 5;
    else if (acc >= 90 && wpm >= target) stars = 4;
    else if (acc >= 80 && wpm >= target * 0.8) stars = 3;
    else if (acc >= 70) stars = 2;
    const existing = getProgress(currentLevel.id);
    const isNewPB = !existing?.bestWPM || wpm > existing.bestWPM;
    saveProgress(currentLevel.id, { stars, wpm, acc, completed: true });
    showResultModal(stars, wpm, acc, errors, isNewPB);
}

function showResultModal(stars, wpm, acc, err, isNewPB) {
    const titlesByLang = {
        ta: ['', 'முயற்சி தொடரு', 'நல்லது', 'சாதனை', 'அருமை', 'மிகச்சிறப்பு'],
        ml: ['', 'വീണ്ടും ശ്രമിക്കുക', 'സരി', 'കാർയ്യം', 'അഭിമാനം', 'അत्यുച്ചമാണ്']
    };
    const titles = titlesByLang[currentLanguage] || titlesByLang.ta;
    document.getElementById('result-title').textContent = titles[stars] || (currentLanguage === 'ml' ? 'പരിണതമായി' : 'முடிந்தது');
    document.getElementById('result-subtitle').textContent = `Level ${currentLevel.id} Complete · ${stars} Stars`;
    let starsHtml = ''; for (let i = 1; i <= 5; i++) starsHtml += `<div class="big-star" id="bstar-${i}" style="transition-delay:${(i - 1) * 0.1}s">★</div>`;
    document.getElementById('stars-display').innerHTML = starsHtml;
    document.getElementById('r-wpm').textContent = wpm; document.getElementById('r-acc').textContent = acc + '%'; document.getElementById('r-err').textContent = err;
    document.getElementById('pb-container').innerHTML = isNewPB ? `<div class="pb-badge">🏆 Personal Best!</div>` : '';
    document.getElementById('result-modal').classList.add('show');
    setTimeout(() => { for (let i = 1; i <= stars; i++) { setTimeout(() => { document.getElementById('bstar-' + i)?.classList.add('lit'); }, i * 150); } }, 100);
}

function retryLevel() { document.getElementById('result-modal').classList.remove('show'); startLevel(currentLevel.id); }
function nextLevel() { document.getElementById('result-modal').classList.remove('show'); const idx = levels.findIndex(l => l.id === currentLevel.id); if (idx < levels.length - 1) startLevel(levels[idx + 1].id); else showView('levels'); }

function renderSideNav() {
    const list = document.getElementById('side-nav-list'); if (!list || !levels.length) return;
    const phases = { 1: 'Phase 1 — Home Row', 2: 'Phase 2 — Expansion', 3: 'Phase 3 — Literature', 4: 'Phase 4 — Numerals' };
    let html = ''; let lastPhase = null;
    levels.forEach(level => {
        if (level.phase !== lastPhase) { html += `<div class="side-nav-group-label">${phases[level.phase] || 'Phase ' + level.phase}</div>`; lastPhase = level.phase; }
        const prog = getProgress(level.id); const stars = prog?.stars || 0; const isActive = currentLevel && currentLevel.id === level.id; const starStr = stars > 0 ? '★'.repeat(stars) : '';
        html += `<div class="side-nav-item ${isActive ? 'active-lesson' : ''} ${stars > 0 ? 'completed-lesson' : ''}" onclick="startLevel(${level.id})"><span class="sni-num">${level.id}</span><span class="sni-title">${level.title}</span>${starStr ? `<span class="sni-stars">${starStr}</span>` : ''}</div>`;
    });
    list.innerHTML = html;
}

function toggleSideNav() { document.getElementById('side-nav').classList.toggle('collapsed'); }
function scrollSideNavToActive() { const active = document.querySelector('#side-nav-list .active-lesson'); if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }

// boot
init();
