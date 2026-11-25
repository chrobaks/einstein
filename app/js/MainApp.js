class MainApp
{
    appProxy;
    GameLandingPage;
    GameApp;
    GameRegistration;
    GameTranslation;
    imgList;

    constructor (TRANSLATION_CONFIG, GAME_CONF, IMAGES)
    {
        this.imgList = IMAGES;
        this.startButton = document.getElementById('btnIntroCtrl');
        this.initializationError = document.getElementById('gameInitializationError');
        this.startButton.disabled = true;
        this.ready = this.initialize(TRANSLATION_CONFIG, GAME_CONF);
    }

    async initialize (translationConfig, gameConfig)
    {
        try {
            this.GameTranslation = new GameTranslation(translationConfig);
            if (!await this.GameTranslation.ready) {
                throw new Error('Translation dictionary could not be loaded');
            }
            this.setPreLoad();
            this.setAppProxy();
            this.GameApp = new GameApp(this.GameTranslation, gameConfig, this.appProxy);
            this.GameRegistration = new GameRegistration(this.appProxy);
            this.GameLandingPage = new GameLandingPage(this.appProxy);
            this.startButton.disabled = false;
            return true;
        } catch (error) {
            console.error('MainAppException:: Could not initialize game', error);
            this.initializationError.hidden = false;
            return false;
        }
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
