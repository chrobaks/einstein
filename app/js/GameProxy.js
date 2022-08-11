class GameProxy
{
    config;
    configHandler;
    configProxy;

    constructor(config, handler=null) {
        this.config = config;
        this.configHandler = handler;
        this.setConfigProxy();
    }

    setConfigProxy() {
        this.configProxy = new Proxy(this.config, this.configHandler);
    }

    setEvent(key, value) {
        if (typeof key === 'string') {
            this.configProxy[key] = value;
        } else if (key.hasOwnProperty('key')) {
            key.map((arg)=>{
                this.configProxy[arg.key] = arg.value;
            })
        }
    }
}