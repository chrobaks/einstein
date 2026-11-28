class MainApp
{
    appProxy;
    GameLandingPage;
    GameApp;
    GameRegistration;
    GameTranslation;
    imgList;

    constructor (AppConfig)
    {
        this.imgList = AppConfig.images;
        this.startButton = document.getElementById('btnIntroCtrl');
        this.initializationError = document.getElementById('gameInitializationError');
        this.startButton.disabled = true;
        this.ready = this.initialize(AppConfig.puzzleVariantId, AppConfig.puzzleJsonId, AppConfig.translationConfig,  AppConfig.gameConf);
    }

    async initialize (puzzleVariantId, jsonId, translationConfig, gameConfig)
    {
        try {
            this.GameTranslation = new GameTranslation(jsonId, translationConfig);
            if (!await this.GameTranslation.initialize()) {
                throw new Error('Translation data could not be initialized');
            }
            this.setPreLoad();
            this.setAppProxy();
            this.GameApp = new GameApp(this.GameTranslation,puzzleVariantId, gameConfig, this.appProxy);
            this.GameRegistration = new GameRegistration(this.appProxy, this.GameTranslation);
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
