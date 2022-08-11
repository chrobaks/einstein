class GameUi
{
    static mousePos = {x: 0, y: 0};
    static config = {};

    static setMousePos (pos)
    {
        this.mousePos.x = pos.x;
        this.mousePos.y = pos.y;
    }

    static setConf (conf)
    {
        this.config = conf;
    }

    static setDisplay (element, show = true)
    {
        element.style.display = (show) ? 'block' : 'none';
    }

    static getElement (tag, css)
    {
        const element = document.createElement(tag);
        if (css) {
            if (typeof css === 'string') {
                element.classList.add(css);
            } else if (css?.length) {
                css.map(style => element.classList.add(style));
            }
        }

        return element;
    }

    static getImg (css, src)
    {
        const img = GameUi.getElement("img", css);
        if (src) {
            img.src = src;
        }

        return img
    }

    static closest (selector, obj)
    {
        const selectorArgs = (selector.match(/\./)) ? selector.split('.').slice(1) : [];
        const datasetArgs = (selector.match(/^\[/)) ? selector : "";

        if (datasetArgs.length && this.checkDataSet(obj.parentElement,datasetArgs)) {
            return obj.parentElement;
        } else if (selectorArgs.length && this.checkClassList(obj.parentElement,selectorArgs)) {
            return obj.parentElement;
        } else if (obj.parentElement.hasAttribute("class") && obj.parentElement.classList.contains(selector)) {
            return obj.parentElement;
        } else if (obj.parentElement.nodeName.toLowerCase() === selector) {
            return obj.parentElement;
        } else {
            if (obj.parentElement.nodeName.toLowerCase() !== 'body') {
                return this.closest(selector, obj.parentElement)
            } else {
                return null;
            }
        }
    }

    static checkDataSet (obj, datasetArgs)
    {
        let result = false;
        let keyArgs = "";
        let key = "";
        let value = "";

        datasetArgs = datasetArgs.replace("[", "");
        datasetArgs = datasetArgs.replace("]", "");
        datasetArgs = datasetArgs.replace("'['", "");
        datasetArgs = datasetArgs.replace('"', "");
        datasetArgs = datasetArgs.replace('data-', "");
        keyArgs = datasetArgs;

        if (datasetArgs.match(/=/)) {
            datasetArgs = datasetArgs.split('=');
            keyArgs = datasetArgs[0];
            value = (datasetArgs.length > 1) ? datasetArgs[1] : "";
        }

        keyArgs = keyArgs.split("-");
        key = keyArgs[0];

        for(let i = 1; i < keyArgs.length; i++) { key += keyArgs[i].charAt(0).toUpperCase() + keyArgs[i].slice(1)}

        if (obj.dataset.hasOwnProperty(key)) {
            result = !(value && this.dataSetValue(obj, key) !== value);
        }

        return result;
    }

    static checkClassList (obj, listClass)
    {
        const getClassName = (arguments.length > 2) ? arguments[2] : 0;
        let result = (getClassName) ? '' : true;

        for (let e in listClass) {
            if (getClassName) {
                if (obj.classList.contains(listClass[e])) {
                    result = listClass[e];
                    break;
                }
            } else {
                if (!obj.classList.contains(listClass[e])) {
                    result = false;
                    break;
                }
            }
        }

        return result;
    }

    static dataSetValue (obj, key)
    {
        return (obj.dataset?.[key]) ? obj.dataset[key] : '';
    }

    static ucFirst(string) {
        return string.substring(0, 1).toUpperCase() + string.substring(1);
    }

    static formData (arrArgs)
    {
        const formData = new FormData();

        for (let e in arrArgs) {
            formData.append(e, arrArgs[e]);
        }

        return formData;
    }

    static formPostData (arrArgs)
    {
        const formData = this.formData(arrArgs);
        return Array
            .from(formData.entries())
            .reduce((m, [key, value]) => Object.assign(m, {[key]: value}), {});
    }

    static preLoadImg (path, index, imgList)
    {
        const img = new Image();

        img.addEventListener('load', () => {
            if (index + 1 < imgList.length) {
                index += 1;
                this.preLoadImg(path, index, imgList);
            }
        });
        img.src = path + "/" + imgList[index];
    }
}