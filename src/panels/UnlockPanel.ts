class UnlockPanel extends Panel {
    private static _instance: UnlockPanel;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('UnlockUI');
        this._ui.getChild('n1').addClickListener(this.onGoToHomeScene, this);
        // 当前的金币数量
        this._ui.getChild('n2').asCom.getChild('n1').text = '99';
        // 解锁关卡的按钮
        this._ui.getChild('n5').addClickListener(this.onUnlock, this);
    }

    private onGoToHomeScene() {
        this.dispatchEvent(new GameEvent(GameEvent.GO_TO_HOME));
        this.close();
    }

    private onUnlock() {
        this.dispatchEvent(new GameEvent(GameEvent.UNLOCK));
        this.close();
    }

    public static get instance(): UnlockPanel {
        if (!UnlockPanel._instance) {
            UnlockPanel._instance = new UnlockPanel();
        }
        return UnlockPanel._instance;
    }
}