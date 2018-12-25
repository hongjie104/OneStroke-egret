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

    /**
     * show
     */
    public show() {
        if (!this._isShowing) {
            this._isShowing = true;
            fairygui.GRoot.inst.addChild(this._ui);
        }
    }

    /**
     * close
     */
    public close() {
        if (this._isShowing) {
            this._isShowing = false;
            fairygui.GRoot.inst.removeChild(this._ui);
        }
    }
}