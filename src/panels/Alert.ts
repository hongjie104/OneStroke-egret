class Alert extends Panel {
    private static _instance: Alert;

    private _panel: fairygui.GComponent;

    private _eventAfterClose: string;

    constructor() {
        super();
    }

    protected init() {
        this._ui = UI.instance.createPanel('Alert');
        this._panel = this._ui.getChild('n1').asCom;
        this._panel.getChild('n8').addClickListener(this.onOK, this);
    }

    public show(param?: any) {
        this._eventAfterClose = param.eventAfterClose
        this._panel.getChild('n6').text = param.title || '提示';
        this._panel.getChild('n7').text = param.content || '内容';
        this._panel.getChild('n8').asCom.getChild('n1').text = param.btnContent || '确定';
        super.show();
    }

    private onOK() {
        this.dispatchEvent(new GameEvent(this._eventAfterClose));
        this.close();
    }

    public static get instance(): Alert {
        if (!Alert._instance) {
            Alert._instance = new Alert();
        }
        return Alert._instance;
    }
}