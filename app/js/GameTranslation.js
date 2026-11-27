class GameTranslation
{
    constructor(jsonId, langConfig)
    {
        this.jsonId = jsonId;
        this.langConfig = langConfig;
    }

    async initialize()
    {
        this.validateConfig();
        this.langs = [...this.langConfig.langs];
        this.fallback = this.langConfig.fallback;
        this.lang = this.getInitialLanguage();
        const translationData = await this.loadTranslations();
        this.hasLanguageMap = this.hasDictionaryForEveryLanguage(translationData);
        this.translations = this.hasLanguageMap
            ? translationData
            : {[this.lang]: translationData};
        this.isReady = true;
        this.languageListeners = new Set();
        this.btnConfig = {
            'item-selector': 'ctrl-trans',
            'active-selector': 'active-trans'
        };
        this.listBtn = document.querySelectorAll('.' + this.btnConfig['item-selector']);
        this.activeBtn = null;

        this.initBtnEvent();
        this.translatePage();

        return true;
    }

    validateConfig()
    {
        const config = this.langConfig;
        if (!config || typeof config !== 'object' || Array.isArray(config)) {
            throw new Error('TranslationException:: A translation config object is required');
        }
        if (!Array.isArray(config.langs) || config.langs.length === 0
            || !config.langs.every(lang => typeof lang === 'string' && lang.trim().length > 0)) {
            throw new Error('TranslationException:: langs must be a non-empty array of language codes');
        }
        if (!config.langs.includes(config.default)) {
            throw new Error('TranslationException:: default must be a supported language');
        }
        if (!config.langs.includes(config.fallback)) {
            throw new Error('TranslationException:: fallback must be a supported language');
        }
        if (this.jsonId !== null && (typeof this.jsonId !== 'string' || this.jsonId.trim().length === 0)) {
            throw new Error('TranslationException:: JSON element ID must be a non-empty string or null');
        }
        if (this.jsonId === null && (typeof config.url !== 'string' || config.url.trim().length === 0)) {
            throw new Error('TranslationException:: A translation URL is required when no JSON element ID is given');
        }
    }

    async loadTranslations()
    {
        let translations;
        if (this.jsonId !== null) {
            const jsonElement = document.getElementById(this.jsonId);
            if (!jsonElement) {
                throw new Error(`TranslationException:: JSON element "${this.jsonId}" was not found`);
            }
            try {
                translations = JSON.parse(jsonElement.textContent);
            } catch (error) {
                throw new Error('TranslationException:: Embedded translation JSON is invalid', {cause: error});
            }
        } else {
            const response = await fetch(this.langConfig.url);
            if (!response.ok) {
                throw new Error(`TranslationException:: Translation request failed with HTTP ${response.status}`);
            }
            translations = await response.json();
        }

        if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
            throw new Error('TranslationException:: Translation data must be an object');
        }

        if (this.hasDictionaryForEveryLanguage(translations)) {
            return translations;
        }

        // PuzzleDataProvider serves the selected locale as the JSON root object.
        return translations;
    }

    getInitialLanguage()
    {
        const pageLanguage = document.documentElement.lang;
        return this.isValidLang(pageLanguage) ? pageLanguage : this.langConfig.default;
    }

    hasDictionaryForEveryLanguage(translations)
    {
        return this.langs.every(lang => Object.prototype.hasOwnProperty.call(translations, lang)
            && translations[lang] && typeof translations[lang] === 'object'
            && !Array.isArray(translations[lang]));
    }

    getText(key, parameters = {})
    {
        if (typeof key !== 'string' || key.length === 0) {
            console.error('TranslationException:: Expected a non-empty translation key');
            return typeof key === 'string' ? key : String(key);
        }
        if (!this.isReady) {
            console.error(`TranslationException:: Translations are not ready for "${key}"`);
            return key;
        }

        const text = this.getTranslationValue(this.lang, key);
        if (typeof text === 'string') {return this.replaceParameters(text, parameters);}

        const fallback = this.getTranslationValue(this.fallback, key);
        if (typeof fallback === 'string') {return this.replaceParameters(fallback, parameters);}

        console.error(`TranslationException:: Missing translation "${key}" for "${this.lang}" and fallback "${this.fallback}"`);
        return key;
    }

    replaceParameters(text, parameters)
    {
        return text.replace(/\{([a-zA-Z0-9_]+)\}/g, (placeholder, name) => {
            return Object.prototype.hasOwnProperty.call(parameters, name)
                ? String(parameters[name]) : placeholder;
        });
    }

    translatePage()
    {
        if (!this.isReady) {return;}
        document.querySelectorAll('[data-trans-key]').forEach(element => {
            const text = this.getPageTranslation(element.dataset.transKey);
            if (typeof text === 'string') {element.textContent = text;}
        });
        // HTML is limited to editorial markup from the maintained translation data.
        document.querySelectorAll('[data-trans-html]').forEach(element => {
            const html = this.getPageTranslation(element.dataset.transHtml);
            if (typeof html === 'string') {element.innerHTML = html;}
        });
        document.documentElement.lang = this.lang;
        this.listBtn.forEach(element => {
            element.setAttribute('aria-pressed', String(element.dataset.transValue === this.lang));
        });
    }

    getPageTranslation(key)
    {
        const translation = this.getTranslationValue(this.lang, key);
        if (typeof translation === 'string') {return translation;}

        const fallback = this.getTranslationValue(this.fallback, key);
        return typeof fallback === 'string' ? fallback : undefined;
    }

    getTranslationValue(lang, key)
    {
        let value = this.translations[this.hasLanguageMap ? lang : this.lang];
        for (const part of key.split('.')) {
            if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, part)) {
                return undefined;
            }
            value = value[part];
        }
        return value;
    }

    initBtnEvent()
    {
        if (!this.listBtn?.length) {
            console.error('TranslationException:: Could not find translation buttons');
            return;
        }

        this.listBtn.forEach(element => {
            const transValue = element.dataset.transValue;
            if (this.lang === transValue && this.isValidLang(this.lang)) {
                this.initActiveBtn(element);
            }
            element.addEventListener('click', () => {
                const buttonLang = element.dataset.transValue;
                if (!element.classList.contains(this.btnConfig['active-selector']) && this.isValidLang(buttonLang)) {
                    this.changeActiveBtn(element);
                }
            });
        });
    }

    initActiveBtn(element)
    {
        element.classList.add(this.btnConfig['active-selector']);
        this.activeBtn = element;
    }

    changeActiveBtn(element)
    {
        const lang = element.dataset.transValue;
        if (!this.isValidLang(lang) || lang === this.lang) {return false;}
        if (!this.hasLanguageMap) {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.location.assign(url.href);
            return true;
        }
        if (this.activeBtn) {
            this.activeBtn.classList.remove(this.btnConfig['active-selector']);
        }
        this.activeBtn = element;
        this.activeBtn.classList.add(this.btnConfig['active-selector']);
        this.lang = lang;
        this.translatePage();
        this.languageListeners.forEach(listener => {
            try {
                listener(this.lang);
            } catch (error) {
                console.error('TranslationException:: Language change listener failed', error);
            }
        });
        return true;
    }

    onLanguageChange(callback)
    {
        if (typeof callback !== 'function') {
            throw new TypeError('TranslationException:: Language change listener must be a function');
        }
        this.languageListeners.add(callback);
        return () => this.languageListeners.delete(callback);
    }

    isValidLang(lang)
    {
        return this.langs.includes(lang);
    }
}
