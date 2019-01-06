class Panel extends egret.EventDispatcher {

    protected _ui: fairygui.GComponent;

    protected _isShowing: boolean = false;

    constructor() {
        super();
        this.init();
    }

    protected init() {
        this._ui = UI.instance.createPanel('RedBag');
    }

    protected beforeShow() { }

    /**
     * show
     */
    public show() {
        if (!this._isShowing) {
            this._isShowing = true;
            this.beforeShow();
            fairygui.GRoot.inst.addChild(this._ui);
            this.dispatchEvent(new PanelEvent(PanelEvent.SHOW));
        }
    }

    /**
     * close
     */
    public close() {
        if (this._isShowing) {
            this._isShowing = false;
            fairygui.GRoot.inst.removeChild(this._ui);
            this.dispatchEvent(new PanelEvent(PanelEvent.CLOSE));
        }
    }
}