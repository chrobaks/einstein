class GameLandingPage
{
    appProxy;

    constructor (AppProxy)
    {
        this.appProxy = AppProxy;
        this.container = document.getElementById('GameLandingPage');
        this.container.querySelector('#btnIntroCtrl').addEventListener('click', () => {
            this.appProxy.setEvent('clickButtonShowGame', true);
        });
    }
}