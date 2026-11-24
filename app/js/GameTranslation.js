class GameTranslation
{
    constructor(langConfig) {
        this.langs = langConfig.langs;
        this.lang = this.isValidLang(langConfig.default)
            ? langConfig.default
            : 'de';
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
            const response = await fetch('json/translation.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const translations = await response.json();
            if (!translations || typeof translations !== 'object' || Array.isArray(translations)
                || !translations.de || typeof translations.de !== 'object' || Array.isArray(translations.de)) {
                throw new Error('Missing or invalid German translation dictionary');
            }
            this.translations = translations;
            this.isReady = true;
            this.translatePage();
            return true;
        } catch (error) {
            console.error('TranslationException:: Could not load translations', error);
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

        const fallback = this.getTranslationValue('de', key);
        if (typeof fallback === 'string') {return fallback;}

        console.error(`TranslationException:: Missing translation "${key}" for "${this.lang}" and fallback "de"`);
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
