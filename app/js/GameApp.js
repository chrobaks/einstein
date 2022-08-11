
class GameApp
{
    appProxy;
    gameProxy;
    itemCategory;
    itemBoard;
    dragItem;
    gameInfo;
    gameButton;
    helpButton;
    gameInstruction;
    gameDialog;
    container;

    constructor (GAME_CONF, AppProxy)
    {
        this.appProxy = AppProxy;
        this.setConfig(...GAME_CONF);
        this.setGameProxy();
        this.setGameObjectsInstance();
        this.renderContainer();
    }

    setConfig (VIEW_ID, ITEMS, TEXT_ALIAS, COLOR_FILTER, CONTENT)
    {
        try {
            GameUi.setConf({
                viewId: VIEW_ID,
                maxHouse: ITEMS[Object.keys(ITEMS)[0]].length,
                items: ITEMS,
                textAlias: TEXT_ALIAS,
                colorFilter: COLOR_FILTER,
                content: CONTENT,
            });
        } catch (error) {console.error(error.message)}
    }

    setGameProxy ()
    {
        this.gameProxy = new GameProxy({}, {
            set: (target, key, obj) => {
                switch(key) {
                    case 'clickDragItem':
                        // obj is OBJECT {dataset:{category,value}}
                        this.setEventClickDragItem(obj);
                        break;
                    case 'clickCategoryItem':
                    case 'clickBoardItem':
                        // obj is OBJECT {dataset:{category,value}}
                        this.setEventClickItem(key, obj);
                        break;
                    case 'clickGameButton':
                        // obj is boolean
                        this.setEventClickGameButton(obj);
                        break;
                    case 'setListItemDisplay':
                        // obj can be STRING or OBJECT {category,value} | {dataset:{category,value}}
                        this.setEventListItemDisplay(obj);
                        break;
                    case 'eventShowGratulation':
                        // obj is empty string
                        this.appProxy.setEvent('gameEventShowRegistration', true);
                        break;
                    case 'eventShowDialog':
                        // obj is number
                        this.gameDialog.showDialog(obj);
                        break;
                    case 'eventSetErrorCount':
                        // obj is integer
                        this.helpButton.setErrorCounter(obj);
                        break;
                    case 'clickButtonDialog':
                        this.gameButton.container.dispatchEvent(new Event('click'));
                        break;
                }
                return true;
            }
        });
    }

    setEventClickDragItem (obj)
    {
        if (!this.itemBoard.setActiveBoard()) {
            this.itemCategory.setListItemDisplay(
                this.itemCategory.container.querySelectorAll(`[data-category="${obj.dataset.category}"]`),
                obj.dataset.value);
        } else {
            this.itemBoard.setActiveBoardIcon(obj);
        }
        this.gameInfo.setContent('', '');
        this.itemBoard.setBoardErrorCount();
    }

    setEventClickItem (key, obj)
    {
        this.dragItem.setIconSrc(obj.src);
        this.dragItem.setIconAttr(obj.dataset.category, obj.dataset.value);
        this.gameInfo.setContent('category', obj.dataset.category);
        this.gameInfo.setContent('value', obj.dataset.value);
        if (key === 'clickBoardItem' && obj.dataset.category === 'color') {
            this.itemBoard.setActiveBoardColor(GameUi.config.colorFilter['default']);
            this.itemBoard.setBoardErrorCount();
        } else if (key === 'clickCategoryItem' && !this.gameButton.gameIsStart) {
            this.gameButton.container.dispatchEvent(new Event('click'));
        }
    }

    setEventClickGameButton (obj)
    {
        const contentKey = (obj) ? 'notice' : 'instruction';
        this.gameInstruction.setContent(contentKey);
        if (!obj) {
            this.itemBoard.resetBoard();
            this.itemBoard.setBoardErrorCount();
        }
    }

    setEventListItemDisplay (obj)
    {
        const category = obj?.category ? obj.category : this.dragItem.icon.dataset.category;
        const value = obj?.value ? obj.value : obj;
        this.itemCategory.setListItemDisplay(
            this.itemCategory.container.querySelectorAll(`[data-category="${category}"]`),
            value
        );
    }

    setGameObjectsInstance ()
    {
        try {
            this.itemCategory = new ItemCategory(this.gameProxy);
            this.itemBoard = new ItemBoard(this.gameProxy);
            this.dragItem = new DragItem(this.gameProxy);
            this.gameButton = new GameButton(this.gameProxy);
            this.helpButton = new HelpButton(this.gameProxy);
            this.gameInfo = new GameInfo();
            this.gameInstruction = new GameInstruction();
            this.gameDialog = new GameDialog(this.gameProxy);
        } catch (error) {console.error(error.message)}
    }

    renderContainer ()
    {
        this.container = document.getElementById(GameUi.config.viewId);
        this.container.append(this.itemCategory.container, this.itemBoard.container);
        this.container.append(this.dragItem.icon);
        this.container.append(this.gameInfo.container);
        this.container.append(this.gameButton.container);
        this.container.append(this.helpButton.container);
        this.container.append(this.gameInstruction.container);
        this.container.append(this.gameDialog.container);

        this.container.addEventListener('mousemove', event => {
            GameUi.setMousePos({
                x: (event.clientX - 20) - this.container.offsetLeft,
                y: (event.clientY - 20) - this.container.offsetTop
            });
            this.dragItem.setIconDragPos();
        });
    }
}

class ItemCategory
{
    gameProxy;
    container;

    constructor(gameProxy)
    {
        this.gameProxy = gameProxy;
        this.container = GameUi.getElement("div", 'container-game-items');
        this.iconList = GameUi.config.items;

        this.setItems();
    }

    setItems ()
    {
        try {
            if (Object.keys(this.iconList).length) {
                for(const [key, value] of Object.entries(this.iconList)) {
                    let topPos = 0;
                    const container = document.createElement("div");
                    container.classList.add('game-items-category');
                    container.setAttribute('data-category',key);
                    if (value?.length) {
                        value.sort();
                        value.map(val => {
                            container.append(this.getImg(key, val, topPos));
                            topPos += 44;
                        });
                    }
                    this.container.append(container);
                }
            }
        } catch (e) {
            console.error("GameItems Error", e.message);
        }
    }

    setListItemDisplay (listItem, value)
    {
        [...listItem].map(icon => {
            if (icon.dataset?.value && icon.dataset.value === value) {
                icon.style.display = 'block';
            }
        });
    }

    getImg (key, val, topPos)
    {
        const img = GameUi.getImg('game-items-category-icon', `items/icon_${val}.gif`);
        img.setAttribute('data-category', key);
        img.setAttribute('data-value', val);
        img.style.top = topPos + 'px';
        img.addEventListener('mousedown', () => {
            this.gameProxy.setEvent('clickCategoryItem', img);
            img.style.display = 'none';
        });

        return img;
    }
}

class ItemBoard
{
    gameProxy;
    container;
    activeBoard;

    constructor(gameProxy)
    {
        this.gameProxy = gameProxy;
        this.container = GameUi.getElement("div", 'container-game-board');
        this.activeBoard = null;

        this.setItems(Object.keys(GameUi.config.items));
        this.setItemEvents();
    }

    setItems (iconCategories)
    {
        for (let i = 0; i < GameUi.config.maxHouse;i++) {
            const clearB = GameUi.getElement("div", 'clearB');
            const house = GameUi.getElement("div", 'house');
            const houseTop = GameUi.getElement("div", 'house-top');
            const houseFlag = GameUi.getElement("div", 'house-flag');
            const houseRoof = GameUi.getElement("div", 'house-roof');
            const houseBox = GameUi.getElement("div", 'house-box');
            houseFlag.append(this.getImg('country', ''));

            iconCategories.map(cat => {
                if ( cat !== 'country') {
                    const houseBoxItem = GameUi.getElement("div", 'house-box-item');
                    houseBoxItem.append(this.getImg(cat, ''));
                    houseBox.append(houseBoxItem);
                }
            });

            house.append(houseTop, houseFlag, clearB, houseRoof, houseBox);
            this.container.append(house);
        }
    }

    setItemEvents ()
    {
        [...this.container.querySelectorAll('img')].map(img => {
            img.addEventListener('mousedown', () => {
                if (img.style.display !== 'none') {
                    this.activeBoard = GameUi.closest('div.house', img);
                    this.gameProxy.setEvent('clickBoardItem', img);
                    img.style.display = 'none';
                }
            });
        });
    }

    setActiveBoard ()
    {
        const top = [282,465];
        const houses = this.container.querySelectorAll('.house');
        let houseIndex = -1;
        if (GameUi.mousePos.y >= top[0] && GameUi.mousePos.y <= top[1]) {
            [...houses].map((house, index) => {
                if (house.offsetLeft <= GameUi.mousePos.x && GameUi.mousePos.x < house.offsetLeft + 139) {
                    houseIndex = index;
                }
            });
        }
        this.activeBoard = (houseIndex >= 0 && houses.length && houseIndex < houses.length)  ? houses[houseIndex] : null;

        return (this.activeBoard !== null);
    }

    setActiveBoardIcon (obj)
    {
        const img = this.activeBoard.querySelector(`[data-category="${obj.dataset.category}"]`);

        if (img.style.display !== 'none') {
            this.gameProxy.setEvent('setListItemDisplay', img.dataset.value);
        }
        img.src = obj.src;
        img.dataset.category = obj.dataset.category;
        img.dataset.value = obj.dataset.value;
        img.style.display = 'block';

        if (obj.dataset.category === 'color') {
            if (GameUi.config.colorFilter?.[obj.dataset.value]) {
                this.setActiveBoardColor(GameUi.config.colorFilter?.[obj.dataset.value], obj.dataset.value);
            }
        }
    }

    setActiveBoardColor (colorProp, color = 'default')
    {
        try {
            const houseTop = this.activeBoard.querySelector('.house-top');
            houseTop.style.backgroundImage = `url('image/dachtop_${color}.gif')`;

            const houseRoof = this.activeBoard.querySelector('.house-roof');
            houseRoof.style.backgroundImage = `url('image/dachcenter_${color}.gif')`;

            const houseBox = this.activeBoard.querySelector('.house-box');
            houseBox.style.backgroundColor = colorProp.backgroundColor;
            houseBox.style.color = colorProp.color;
        } catch (error) {console.error(error.message)}
    }

    getImg (key, val)
    {
        const img = GameUi.getImg('house-icon', '');
        img.setAttribute('data-category', key);
        img.setAttribute('data-value', val);

        return img;
    }

    setBoardErrorCount ()
    {
        const houseList = this.container.querySelectorAll(`.house`);
        let formData = [];

        [...houseList].map((house, index) => {
            const imgList = house.querySelectorAll(`img`);
            const houseId = `house${index+1}`;
            formData[houseId] = [];
            [...imgList].map(img => {
                if (img.style.display === 'block') {
                    formData[houseId].push(img.dataset.value);
                }
            });
        });

        this.setSolutionRequest(formData);
    }

    setSolutionRequest (formData)
    {
        formData["act"] = "solution";

        fetch('backend/game.php', {
            method: 'post',
            body: JSON.stringify(GameUi.formPostData(formData)),
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.matches !== undefined && data.matches*1 === 25) {
                    if (data.errors*1 === 0) {
                        this.gameProxy.setEvent('eventShowGratulation', '');
                    } else {
                        this.gameProxy.setEvent('eventShowDialog', data.errors);
                    }
                } else if (data?.errors !== undefined) {
                    this.gameProxy.setEvent('eventSetErrorCount', data.errors*1);
                }
            })
            .catch((error) => {
                if (typeof error !== 'undefined') {
                    console.error("Error GameAppRequest: " + error.message);
                }
            });
    }

    resetBoard ()
    {
        const houseList = this.container.querySelectorAll(`.house`);
        [...houseList].map(house => {
            const imgList = house.querySelectorAll(`img`);
            this.activeBoard = house;
            [...imgList].map(img => {
                if (img.style.display !== 'none') {
                    this.gameProxy.setEvent('setListItemDisplay', img.dataset);
                    img.src = '';
                    img.style.display = 'none';
                    if (img.dataset.category === 'color') {
                        this.setActiveBoardColor(GameUi.config.colorFilter?.['default']);
                    }
                }
            });
        });
    }
}

class DragItem
{
    gameProxy;
    icon;

    constructor(gameProxy)
    {
        this.gameProxy = gameProxy;
        this.icon = GameUi.getImg('game-icon-drag', '');
        this.setIconAttr('', '');

        this.icon.addEventListener('load', () => {
            this.setIconDragPos();
            this.icon.style.display = 'block';
        });

        this.icon.addEventListener('mouseup', () => {
            this.gameProxy.setEvent('clickDragItem', this.icon);
            this.icon.style.display = 'none';
        });
    }

    setIconDragPos ()
    {
        this.icon.style.left = GameUi.mousePos.x + 'px';
        this.icon.style.top = GameUi.mousePos.y + 'px';
    }

    setIconSrc (src)
    {
        this.icon.src = src;
    }

    setIconAttr (category, value)
    {
        this.icon.setAttribute('data-category', category);
        this.icon.setAttribute('data-value', value);
    }
}

class GameButton
{
    gameProxy;
    container;
    gameIsStart;

    constructor (gameProxy)
    {
        this.gameProxy = gameProxy;
        this.container = GameUi.getElement("div", 'game-button-start');
        this.gameIsStart = false;

        this.setContent();
        this.setEvents();
    }

    setContent (text = "start")
    {
        this.container.innerText = text.toUpperCase();
    }

    setEvents ()
    {
        this.container.addEventListener('click', () => {
            this.gameIsStart = !(this.gameIsStart === true);
            this.gameProxy.setEvent('clickGameButton', this.gameIsStart);
            const text = this.gameIsStart ? 'beenden' : 'start';
            this.setContent(text);
        });
    }
}

class HelpButton
{
    gameProxy;
    container;
    playWithHelp;
    firstLayer;
    secondLayer;
    helpText;
    helpBtn;
    errorCountContainer;
    errorCount;

    constructor (gameProxy)
    {
        this.gameProxy = gameProxy;
        this.container = GameUi.getElement("div", 'game-button-help');
        this.playWithHelp = false;
        this.errorCount = 0;

        this.renderContainer();
        this.setEvents();
    }

    renderContainer ()
    {
        const helpTextDiv = GameUi.getElement("div", '');

        this.firstLayer = GameUi.getElement("div", ['button-help-layer', 'first-layer', 'active']);
        this.firstLayer.innerText = 'Spielhilfe';

        this.secondLayer = GameUi.getElement("div", ['button-help-layer', 'second-layer']);
        this.helpText = GameUi.getElement("div", 'second-layer-text');
        this.errorCountContainer = GameUi.getElement("span", 'game-error-count');
        this.errorCountContainer.innerText = this.errorCount;
        helpTextDiv.innerHTML = 'Fehleranzahl: ';
        helpTextDiv.append(this.errorCountContainer);
        this.helpText.append(helpTextDiv);

        this.helpBtn = GameUi.getElement("div", 'second-layer-btn');
        this.helpBtn.innerHTML = '<div>Hilfe beenden</div>';

        this.secondLayer.append(this.helpText, this.helpBtn);

        this.container.append(this.firstLayer, this.secondLayer);
    }

    setEvents ()
    {
        [...this.container.querySelectorAll('.button-help-layer')].map(layer => {
            layer.addEventListener('click', () => {
                this.playWithHelp = !(this.playWithHelp === true);
                if (this.playWithHelp) {
                    this.firstLayer.classList.remove('active');
                    this.secondLayer.classList.add('active');
                } else {
                    this.secondLayer.classList.remove('active');
                    this.firstLayer.classList.add('active');
                }

            });
        });
    }

    setErrorCounter (errorCount)
    {
        this.errorCountContainer.innerText = errorCount;
    }
}

class GameInstruction
{
    container;
    scrollContainer;
    contentContainer;

    constructor ()
    {
        this.container = GameUi.getElement("div", 'container-game-instruction');

        this.renderContainer();
        this.setContent();
    }

    renderContainer ()
    {
        this.scrollContainer = GameUi.getElement("div", 'scroll');
        this.contentContainer = GameUi.getElement("div", 'game-instruction');
        this.scrollContainer.append(this.contentContainer);
        this.container.append(this.scrollContainer);
    }

    setContent (contentKey = 'instruction')
    {
        const content = GameUi.config.content[contentKey];
        this.scrollContainer.scrollTo(0, 0);
        this.contentContainer.innerHTML = "";
        content.map(data => {
            const p  = GameUi.getElement("p", '');
            const header = GameUi.getElement("b", '');
            const text = (contentKey === 'instruction')
                ? GameUi.getElement("span", '')
                : GameUi.getElement("ul", '');
            const br = document.createElement('br');
            header.innerText = data.header;
            text.innerHTML = data.text;
            p.append(header, br, text);
            this.contentContainer.append(p);
        });
    }
}

class GameInfo
{
    container;

    constructor ()
    {
        this.container = GameUi.getElement("div", 'container-game-drag-info');

        this.renderContainer();
    }

    renderContainer ()
    {
        const boxCat = GameUi.getElement("div", 'game-drag-info-box');
        boxCat.setAttribute('data-info', 'category');
        const boxVal = GameUi.getElement("div", 'game-drag-info-box');
        boxVal.setAttribute('data-info', 'value');
        this.container.append(boxCat, boxVal)
    }

    setContent (infoKey, infoValue)
    {
        if (infoKey) {
            const box = this.container.querySelector(`[data-info="${infoKey}"]`);
            if (box) {
                infoValue = (GameUi.config.textAlias?.[infoValue]) ? GameUi.config.textAlias[infoValue] : infoValue;
                box.innerText = GameUi.ucFirst(infoValue);
            }
        } else {
            [...this.container.querySelectorAll(`[data-info]`)].map(box => { box.innerText = ''; });
        }
    }
}

class GameDialog
{
    gameProxy;
    container;
    content;

    constructor (eventProxy)
    {
        this.gameProxy = eventProxy;
        this.container = GameUi.getElement("div", 'container-game-overlay');
        this.renderContainer();
        this.setContent();
    }

    renderContainer ()
    {
        const dialog = GameUi.getElement("div", 'game-overlay-dialog');
        const header = GameUi.getElement("div", 'overlay-dialog-header');
        this.content = GameUi.getElement("div", 'overlay-dialog-content');
        dialog.append(header, this.content);

        this.container.append(dialog);
    }

    setContent ()
    {
        const h3 = GameUi.getElement("h3", 'txt-green');
        const noMatter = GameUi.getElement("div", 'txt-bold');
        noMatter.innerText = 'Das macht nichts!';
        const description = GameUi.getElement("div", '');
        description.innerText = 'Angeblich meinte Einstein mit "nicht lösen", das nur 2% der Weltbevölkerung nicht aufgeben. Sie werden das Rätsel lösen, in dem sie aus ihren Fehlern lernen!';
        const btn = GameUi.getElement("button", 'btn');
        btn.innerText = 'Ich versuche es nochmal!';
        this.content.append(h3, noMatter, description, btn);
        btn.addEventListener('click', () => {
            this.container.style.display = 'none';
            this.gameProxy.setEvent('clickButtonDialog','');
        });
    }

    showDialog (errors)
    {
        this.content.querySelector("h3").innerText = `Du hast ${errors} Fehler gemacht.`;
        this.container.style.display = 'block';
    }
}