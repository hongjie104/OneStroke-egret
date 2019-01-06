class RedBagAward extends Panel {

    private static _instance: RedBagAward;
    
    private _curMoneyAward: number = 0;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('RedBagAward');
        // 所获得的奖励
        // this._ui.getChild('n3').text = '￥3.6元';
        // 余额
        // this._ui.getChild('n4').text = '余额￥21.7元';
        this._ui.getChild('n5').text = '满20元可提现';
        this._ui.getChild('n6').addClickListener(this.onGoOn, this);
    }

    /**
     * setRedBagAward
     */
    public setRedBagAward(val: number) {
        this._curMoneyAward = val;
        this._ui.getChild('n3').text = `￥${this._curMoneyAward.toFixed(2)}元`;
    }

    protected beforeShow() {
        const money = LocalStorage.getItem(LocalStorageKey.money);
        this._ui.getChild('n4').text = `余额￥${money.toFixed(2)}元`;
    }

    private onGoOn() {
        this.dispatchEvent(new GameEvent(GameEvent.GET_MONEY_AWARD));
        this.close();
    }

    public static get instance(): RedBagAward {
        if (!RedBagAward._instance) {
            RedBagAward._instance = new RedBagAward();
        }
        return RedBagAward._instance;
    }

}