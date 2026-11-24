class GameTranslation
{
    constructor() {
        this.btnConfig = {
            'item-selector' : 'ctrl-trans',
            'active-selector' : 'active-trans'
        }
        this.listBtn = document.querySelectorAll('.' + this.btnConfig['item-selector']);
        this.activeBtn = null;

        this.initBtnEvent();
    }

    initBtnEvent () {
        console.log('init initBtnEvent');
        if (this.listBtn?.length) {
            this.listBtn.forEach(element => {
                element.addEventListener('click', () => {
                    if (!element.classList.contains(this.btnConfig['active-selector'])) {
                        this.changeActiveBtn(element);
                        console.log(element.dataset.transValue)
                    }
                });
            });
        }
    }

    changeActiveBtn (element) {
        if (!this.activeBtn) {
            this.activeBtn = document.querySelector('.' + this.btnConfig['active-selector']);
            if (!this.activeBtn) {return false;}
        }
        this.activeBtn.classList.remove(this.btnConfig['active-selector']);
        this.activeBtn = element;
        this.activeBtn.classList.add(this.btnConfig['active-selector']);

    }
}