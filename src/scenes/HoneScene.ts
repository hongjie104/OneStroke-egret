class HomeScene extends egret.DisplayObjectContainer {

    private _ui: fairygui.GComponent;

    constructor() {
        super();
        this._ui = UI.instance.createPanel('HomeUI');
        this._ui.getChild('n1').addClickListener(this.onStartGame, this);

        let account: string = LocalStorage.getItem(LocalStorageKey.account);
        if (!account) {
            account = utils.UUID.create(10, 10);
            LocalStorage.setItem(LocalStorageKey.account, account);
        }
        this._ui.getChild('n11').asTextField.text = `UID: ${account}`;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    private onAddToStage() {
        fairygui.GRoot.inst.addChild(this._ui);
    }

    private onRemoveFromStage() {
        fairygui.GRoot.inst.removeChild(this._ui);
    }

    private onStartGame() {
        this.dispatchEvent(new GameEvent(GameEvent.START_GAME));
    }
}