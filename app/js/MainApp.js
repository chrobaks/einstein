class MainApp
{
    appProxy;
    GameLandingPage;
    GameApp;
    GameRegistration;
    imgList;

    constructor (GAME_CONF, IMAGES)
    {
        this.imgList = IMAGES;

        this.setPreLoad();
        this.setAppProxy();

        this.GameLandingPage = new GameLandingPage(this.appProxy);
        this.GameApp = new GameApp(GAME_CONF,this.appProxy);
        this.GameRegistration = new GameRegistration(this.appProxy);

    }

    setPreLoad ()
    {
        GameUi.preLoadImg('image', 0, this.imgList['image']);
        GameUi.preLoadImg('items', 0, this.imgList['items']);
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
}