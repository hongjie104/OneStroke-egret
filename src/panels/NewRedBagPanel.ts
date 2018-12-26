class NewRedBagPanel extends Panel {
    private static _instance: NewRedBagPanel;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('NewRedBag');
        this._ui.getChild('n3').addClickListener(this.onGetMoney, this);
        this._ui.getChild('n4').text = '余额：99.99元';
    }

    private onGetMoney() {
        this.dispatchEvent(new GameEvent(GameEvent.GET_MONEY));
        this.close();
    }

    public static get instance(): NewRedBagPanel {
        if (!NewRedBagPanel._instance) {
            NewRedBagPanel._instance = new NewRedBagPanel();
        }
        return NewRedBagPanel._instance;
    }
}