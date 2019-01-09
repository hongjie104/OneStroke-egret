class RedBag extends Panel {

    private static _instance: RedBag;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('RedBag');
        this._ui.getChild('n3').addClickListener(this.close, this);
        // this._ui.getChild('n9').text = '余额 ￥3.6元';
        // 还剩多少关有红包
        // this._ui.getChild('n8').asCom.getChild('n1').text = '8';
    }

    protected beforeShow() {
        const money = parseFloat(LocalStorage.getItem(LocalStorageKey.money));
        this._ui.getChild('n9').text = `余额 ￥${money.toFixed(2)}元`;
    }

    public static get instance(): RedBag {
        if (!RedBag._instance) {
            RedBag._instance = new RedBag();
        }
        return RedBag._instance;
    }

}