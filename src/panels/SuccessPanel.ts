class SuccessPanel extends Panel {

    private static _instance: SuccessPanel;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('SuccessUI');
        this._ui.getChild('n4').addClickListener(this.onNextLevel, this);
        this._ui.getChild('n1').addClickListener(this.onGoToHomeScene, this);
    }

    private onNextLevel() {
        this.dispatchEvent(new GameEvent(GameEvent.NEXT_LEVEL));
        this.close();
    }

    private onGoToHomeScene() {
        this.close();
        this.dispatchEvent(new GameEvent(GameEvent.GO_TO_HOME));
    }

    public static get instance(): SuccessPanel {
        if (!SuccessPanel._instance) {
            SuccessPanel._instance = new SuccessPanel();
        }
        return SuccessPanel._instance;
    }
}