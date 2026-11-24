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

        this.initBtnEvent();
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
    }

    isValidLang (lang)
    {
        return this.langs.includes(lang);
    }
}