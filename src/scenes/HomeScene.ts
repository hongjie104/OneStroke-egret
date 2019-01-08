class HomeScene extends egret.DisplayObjectContainer {

    private _ui: fairygui.GComponent;

    private _redBagTip: fairygui.GComponent;

    private _timer: egret.Timer;

    constructor(private _redBagJson: { name: Array<string>, money: Array<number> }) {
        super();
        this._ui = UI.instance.createPanel('HomeUI');
        this._ui.getChild('n1').addClickListener(this.onStartGame, this);

        let uid: string = LocalStorage.getItem(LocalStorageKey.uid);
        if (!uid) {
            uid = utils.UUID.create(10, 10);
            LocalStorage.setItem(LocalStorageKey.uid, uid);
        }
        // this._ui.getChild('n11').asTextField.text = `UID: ${uid}`;
        this._redBagTip = this._ui.getChild('n14').asCom;

        // 红包按钮
        this._ui.getChild('n15').addClickListener(this.onShowRedBagPanel, this);

        // 开始一个定时器，显示提现红包的数据
        this._timer = new egret.Timer(utils.MathUtils.getRandom(5000, 10000));
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.showRedTip, this);

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    private onAddToStage() {
        fairygui.GRoot.inst.addChild(this._ui);
        // 先把提示框放在屏幕右边
        this._redBagTip.x = this.stage.stageWidth;
        this._timer.start();
    }

    private onRemoveFromStage() {
        fairygui.GRoot.inst.removeChild(this._ui);
    }

    private onStartGame() {
        this.dispatchEvent(new GameEvent(GameEvent.START_GAME));
    }

    private onShowRedBagPanel() {
        RedBag.instance.show();
    }

    private showRedTip() {
        this._timer.stop();
        if (this.stage) {
            const stageWidth: number = this.stage.stageWidth;
            const nameArr = this._redBagJson.name;
            const name = nameArr[utils.MathUtils.getRandom(0, nameArr.length - 1)];
            const moneyArr = this._redBagJson.money;
            const money = moneyArr[utils.MathUtils.getRandom(0, moneyArr.length - 1)];
            this._redBagTip.getChild('n1').asRichTextField.text = `恭喜<font color="#f5e20f">${name}</font>成功提现<font color="#f5e20f">${money}</font>元`;
            egret.Tween.get(this._redBagTip)
                .to({ x: (stageWidth - this._redBagTip.actualWidth) / 2 }, 1000)
                .wait(3000)
                .to({ x: -this._redBagTip.actualWidth }, 1000)
                .call(() => {
                    this._redBagTip.x = stageWidth;
                    this._timer.delay = utils.MathUtils.getRandom(5000, 10000);
                    this._timer.start();
                }, this);
        }
    }
}