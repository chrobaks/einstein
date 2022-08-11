class MainApp
{
    appProxy;
    GameLandingPage;
    GameApp;
    GameRegistration;
    imgList;

    constructor (GAME_CONF)
    {
        this.setPreLoad();
        this.setAppProxy();

        this.GameLandingPage = new GameLandingPage(this.appProxy);
        this.GameApp = new GameApp(GAME_CONF,this.appProxy);
        this.GameRegistration = new GameRegistration(this.appProxy);

    }

    setPreLoad ()
    {
        this.imgList = {
            'image' : [
                'game_bg.png',
                'bg_house.gif',
                'dachtop_default.gif',
                'dachtop_gruen.gif',
                'dachtop_rot.gif',
                'dachtop_gelb.gif',
                'dachtop_blau.gif',
                'dachtop_weiss.gif',
                'dachcenter_default.gif',
                'dachcenter_gruen.gif',
                'dachcenter_rot.gif',
                'dachcenter_gelb.gif',
                'dachcenter_blau.gif',
                'dachcenter_weiss.gif',
                'bg_item.gif',
                'bg_textfield.gif',
            ],
            'items': [
                'icon_daenemark.gif',
                'icon_deutschland.gif',
                'icon_england.gif',
                'icon_italien.gif',
                'icon_norwegen.gif',
                'icon_gelb.gif',
                'icon_blau.gif',
                'icon_rot.gif',
                'icon_gruen.gif',
                'icon_weiss.gif',
                'icon_katze.gif',
                'icon_pferd.gif',
                'icon_vogel.gif',
                'icon_fisch.gif',
                'icon_hund.gif',
                'icon_wasser.gif',
                'icon_wein.gif',
                'icon_milch.gif',
                'icon_kaffe.gif',
                'icon_bier.gif',
                'icon_laufen.gif',
                'icon_fussball.gif',
                'icon_ringen.gif',
                'icon_turnen.gif',
                'icon_rudern.gif',
            ]
        };

        this.loadImg('image', 0, this.imgList['image'].length);
        this.loadImg('items', 0, this.imgList['items'].length);
    }

    setAppProxy ()
    {
        this.appProxy = new GameProxy({}, {
            set: (target, key, obj) => {
                switch(key) {
                    case 'clickButtonShowGame':
                        // obj is boolean
                        GameUi.setDisplay(this.GameLandingPage.container, false);
                        GameUi.setDisplay(this.GameApp.container);
                        break;
                    case 'gameEventShowRegistration':
                        // obj is boolean
                        GameUi.setDisplay(this.GameApp.container, false);
                        GameUi.setDisplay(this.GameRegistration.container);
                        break;
                }
                return true;
            }
        });
    }

    loadImg (path, index, maxIndex)
    {
        const img = new Image();

        img.addEventListener('load', () => {
            if (index + 1 < maxIndex) {
                index += 1;
                this.loadImg(path, index, maxIndex);
            }
        });
        img.src = path + "/" + this.imgList[path][index];
    }
}