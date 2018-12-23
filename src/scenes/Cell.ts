class Cell extends egret.Shape {
    constructor(private _row: number, private _col: number, public size = 65, public ellipse = 12, private _status) {
        super();
        this.init();
        this.once(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    private init() {
        const graphics = this.graphics;
        graphics.beginFill(this._status > 0 ? 0xd0d0d0 : 0xffffff);
        graphics.drawRoundRect(0, 0, this.size, this.size, this.ellipse);
        graphics.endFill();

        if (this._status > 0) {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        }
    }

    private onTouchBegin() {
        this.dispatchEvent(new CellEvent(CellEvent.TRY_2_ADD_2_ARR, this._row, this._col));
    }

    private onTouchMove() {
        this.dispatchEvent(new CellEvent(CellEvent.ADD_2_ARR, this._row, this._col));
    }

    private onRemoveFromStage() {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
    }
}