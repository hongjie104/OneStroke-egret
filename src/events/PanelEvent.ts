class PanelEvent extends egret.Event {

    public static SHOW: string = 'showPanel';

    public static CLOSE: string = 'closePanel';

    constructor(type) {
        super(type);
    }
}