class SuccessPanel extends Panel {

    private static _instance: SuccessPanel;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('SuccessUI');
        this._ui.getChild('n4').addClickListener(this.onNextLevel, this);
    }

    private onNextLevel() {
        this.dispatchEvent(new GameEvent(GameEvent.NEXT_LEVEL));
        this.close();
    }

    public static get instance(): SuccessPanel {
        if (!SuccessPanel._instance) {
            SuccessPanel._instance = new SuccessPanel();
        }
        return SuccessPanel._instance;
    }
}