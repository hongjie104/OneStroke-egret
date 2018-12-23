class CellEvent extends egret.Event {

    public static ADD_2_ARR = 'add2Arr';

    public static TRY_2_ADD_2_ARR = 'try2Add2Arr';

    constructor(type, private _row: number, private _col: number) {
        super(type);
    }

    public get row(): number {
        return this._row;
    }

    public get col(): number {
        return this._col;
    }
}