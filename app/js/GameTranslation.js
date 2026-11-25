class GameTranslation
{
    constructor(langConfig) {
        if (!langConfig || !Array.isArray(langConfig.langs) || langConfig.langs.length === 0
            || !langConfig.langs.every(lang => typeof lang === 'string' && lang.trim().length > 0)) {
            throw new Error('TranslationException:: langs must be a non-empty array of language codes');
        }
        this.langs = [...langConfig.langs];
        if (!this.isValidLang(langConfig.fallback)) {
            throw new Error('TranslationException:: fallback must be a supported language');
        }
        if (typeof langConfig.url !== 'string' || langConfig.url.trim().length === 0) {
            throw new Error('TranslationException:: url must be a non-empty string');
        }
        this.fallback = langConfig.fallback;
        this.url = langConfig.url;
        this.lang = this.isValidLang(langConfig.default)
            ? langConfig.default
            : this.fallback;
        if (!this.isValidLang(langConfig.default)) {
            console.warn(`TranslationException:: Unsupported default language; using fallback "${this.fallback}"`);
        }
        this.btnConfig = {
            'item-selector' : 'ctrl-trans',
            'active-selector' : 'active-trans'
        }
        this.listBtn = document.querySelectorAll('.' + this.btnConfig['item-selector']);
        this.activeBtn = null;
        this.translations = {};
        this.isReady = false;

        this.initBtnEvent();
        this.ready = this.loadTranslations();
    }

    async loadTranslations () {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const translations = await response.json();
            if (!translations || typeof translations !== 'object' || Array.isArray(translations)
                || !Object.prototype.hasOwnProperty.call(translations, this.fallback)
                || !translations[this.fallback] || typeof translations[this.fallback] !== 'object'
                || Array.isArray(translations[this.fallback])) {
                throw new Error(`Missing or invalid fallback dictionary "${this.fallback}"`);
            }
            this.translations = translations;
            this.isReady = true;
            this.translatePage();
            return true;
        } catch (error) {
            console.error(`TranslationException:: Could not load translations from "${this.url}"`, error);
            return false;
        }
    }

    getText (key) {
        if (typeof key !== 'string' || key.length === 0) {
            console.error('TranslationException:: Expected a non-empty translation key');
            return typeof key === 'string' ? key : String(key);
        }
        if (!this.isReady) {
            console.error(`TranslationException:: Translations are not ready for "${key}"`);
            return key;
        }

        const text = this.getTranslationValue(this.lang, key);
        if (typeof text === 'string') {return text;}

        const fallback = this.getTranslationValue(this.fallback, key);
        if (typeof fallback === 'string') {return fallback;}

        console.error(`TranslationException:: Missing translation "${key}" for "${this.lang}" and fallback "${this.fallback}"`);
        return key;
    }

    translatePage () {
        if (!this.isReady) {return;}
        document.querySelectorAll('[data-trans-key]').forEach(element => {
            element.textContent = this.getText(element.dataset.transKey);
        });
        // HTML is limited to editorial markup from our maintained dictionary.
        document.querySelectorAll('[data-trans-html]').forEach(element => {
            element.innerHTML = this.getText(element.dataset.transHtml);
        });
        document.documentElement.lang = this.lang;
        this.listBtn.forEach(element => {
            element.setAttribute('aria-pressed', String(element.dataset.transValue === this.lang));
        });
    }

    getTranslationValue (lang, key) {
        let value = this.translations[lang];
        for (const part of key.split('.')) {
            if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, part)) {
                return undefined;
            }
            value = value[part];
        }
        return value;
    }

    initBtnEvent () {
        if (this.listBtn?.length) {
            this.listBtn.forEach(element => {
                const transValue = element.dataset.transValue;
                if (this.lang === transValue && this.isValidLang(this.lang)) {
                    this.initActiveBtn(element);
                }
                element.addEventListener('click', () => {
                    const transValue = element.dataset.transValue;
                    if (!element.classList.contains(this.btnConfig['active-selector']) && this.isValidLang(transValue)) {
                        this.changeActiveBtn(element);
                    }
                });
            });
        } else {
            console.error('TranslationException:: Could not find translation buttons');
        }
    }

    initActiveBtn (element) {
        element.classList.add(this.btnConfig['active-selector']);
        this.activeBtn = element;
    }

    changeActiveBtn (element) {
        if (!this.activeBtn) {
            this.activeBtn = document.querySelector('.' + this.btnConfig['active-selector']);
            if (!this.activeBtn) {return false;}
        }
        this.activeBtn.classList.remove(this.btnConfig['active-selector']);
        this.activeBtn = element;
        this.activeBtn.classList.add(this.btnConfig['active-selector']);
        this.lang = element.dataset.transValue;
        this.translatePage();
    }

    isValidLang (lang)
    {
        return this.langs.includes(lang);
    }
}
