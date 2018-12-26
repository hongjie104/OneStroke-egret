class AwardPanel extends Panel {
    private static _instance: AwardPanel;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('AwardUI');
        this._ui.getChild('n1').addClickListener(this.close, this);
        // 当前的金币数量
        this._ui.getChild('n2').asCom.getChild('n1').text = '99';
        // 领取奖励的按钮
        this._ui.getChild('n4').addClickListener(this.onGetAward, this);
    }

    private onGetAward() {
        this.dispatchEvent(new GameEvent(GameEvent.GET_AWARD));
        this.close();
    }

    public static get instance(): AwardPanel {
        if (!AwardPanel._instance) {
            AwardPanel._instance = new AwardPanel();
        }
        return AwardPanel._instance;
    }
}