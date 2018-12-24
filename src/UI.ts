class UI {

    private static _instance: UI;

    private _stageWidth: number;

    private _stageHeight: number;

    public createPanel(panelName: string): fairygui.GComponent {
        const p: fairygui.GComponent = fairygui.UIPackage.createObject("Package1", panelName).asCom;
        p.viewWidth = this._stageWidth;
        p.viewHeight = this._stageHeight;
        return p;
    }

    public set stageWidth(val: number) {
        this._stageWidth = val;
    }

    public set stageHeight(val: number) {
        this._stageHeight = val;
    }

    public static get instance() {
        if (!UI._instance) {
            UI._instance = new UI();
        }
        return UI._instance;
    }

}