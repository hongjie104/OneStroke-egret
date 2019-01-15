class GameScene extends egret.DisplayObjectContainer {

    private static GAP  = 12;

    private static CELL_SIZE = 74;

    private static CELL_ELLIPSE = 16;

    private cellArr = new Array<Array<Cell>>();

    private cellContainer: egret.DisplayObjectContainer;

    private selectedCellShape: egret.Shape;

    private pathShap: egret.Shape;

    private selectedRowAndCol: Array<{ row: number, col: number }>;

    // 当前关卡
    private curLevel = 1;

    private _ui: fairygui.GComponent;

    private _timer: egret.Timer;

    private _redBagTip: fairygui.GComponent;

    constructor(private _levelJson: Array<ILEVEL>, private _redBagJson: { name: Array<string>, money: Array<number> }) {
        super();
        this.curLevel = LocalStorage.getItem(LocalStorageKey.curLevel);
        this._ui = UI.instance.createPanel('GameUI');
        this._ui.getChild('n1').asButton.addClickListener(this.onBack, this);
        this._ui.getChild('n3').asButton.addClickListener(this.onReplay, this);
        this._ui.getChild('n5').asButton.addClickListener(this.onDollarTip, this);

        // 重玩次数
        this.updateLeftReplayCount();

        // 金币数量
        // this._ui.getChild('n7').asCom.getChild('n1').asTextField.text = '30';

        this._ui.getChild('n12').asButton.addClickListener(this.onShowRedBagPanel, this);

        this._redBagTip = this._ui.getChild('n13').asCom;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);

        // 开始一个定时器，显示提现红包的数据
        this._timer = new egret.Timer(utils.MathUtils.getRandom(5000, 10000));
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.showRedTip, this);
    }

    private updateLeftReplayCount() {
        const leftReplayCount = LocalStorage.getItem(LocalStorageKey.leftReplayCount);
        this._ui.getChild('n3').asCom.getChild('n3').text = `(${leftReplayCount}次机会)`;
    }

    private onAddToStage() {
        fairygui.GRoot.inst.addChild(this._ui);
        if (this.pathShap) {
            this.pathShap.graphics.clear();
        }
        // 先把提示框放在屏幕右边
        this._redBagTip.x = this.stage.stageWidth;
        this._timer.start();
        this.drawCell();
    }

    private onRemoveFromStage() {
        fairygui.GRoot.inst.removeChild(this._ui);
    }

    private onShowRedBagPanel() {
        RedBag.instance.show();
    }

    private drawCell() {
        this._ui.getChild('n9').text = `${this.curLevel}关`;
        const selectedRowAndCol = LocalStorage.getItem(LocalStorageKey.selectedRowAndCol);
        this.selectedRowAndCol = selectedRowAndCol || new Array<{ row: number, col: number }>();
        if (!this.cellContainer) {
            this.cellContainer = new egret.DisplayObjectContainer();
        }
        let cell: Cell = null;
        for (let row = 0; row < this.cellArr.length; row++) {
            for (let col = 0; col < this.cellArr[0].length; col++) {
                cell = this.cellArr[row][col];
                cell.removeEventListener(CellEvent.ADD_2_ARR, this.onAddCell2Arr, this);
                cell.removeEventListener(CellEvent.TRY_2_ADD_2_ARR, this.onTry2AddCell2Arr, this);
                this.cellContainer.removeChild(cell);
            }
        }
        this.cellArr.length = 0;

        const levelData: ILEVEL = this._levelJson[this.curLevel - 1];
        const rows = levelData.map.length;
        const cols = levelData.map[0].length;
        for (let row = 0; row < rows; row++) {
            this.cellArr[row] = new Array<Cell>();
            for (let col = 0; col < cols; col++) {
                cell = new Cell(row, col, GameScene.CELL_SIZE, GameScene.CELL_ELLIPSE, levelData.map[row][col]);
                cell.x = col * (cell.width + GameScene.GAP);
                cell.y = row * (cell.height + GameScene.GAP);
                this.cellContainer.addChild(cell);
                this.cellArr[row][col] = cell;
                cell.addEventListener(CellEvent.ADD_2_ARR, this.onAddCell2Arr, this);
                cell.addEventListener(CellEvent.TRY_2_ADD_2_ARR, this.onTry2AddCell2Arr, this);

                if (levelData.map[row][col] === 2) {
                    // 起点
                    if (this.selectedRowAndCol.length === 0) {
                        this.selectedRowAndCol.push({ row, col });
                    } else if (this.selectedRowAndCol[0].row !== row || this.selectedRowAndCol[0].col !== col) {
                        // 这就有问题了
                        this.selectedRowAndCol.length = 1;
                        this.selectedRowAndCol[0] = { row, col };
                        LocalStorage.setItem(LocalStorageKey.selectedRowAndCol, this.selectedRowAndCol);
                        LocalStorage.saveToLocal();
                    }
                }
            }
        }
        this.cellContainer.x = (this.stage.stageWidth - this.cellContainer.width) / 2;
        this.cellContainer.y = 300;
        if (this.cellContainer.parent !== this) {
            this.addChild(this.cellContainer);
        }

        if (!this.selectedCellShape) {
            this.selectedCellShape = new egret.Shape();
            this.cellContainer.addChild(this.selectedCellShape);
        } else {
            this.cellContainer.setChildIndex(this.selectedCellShape, this.cellContainer.numChildren + 1);
        }
        if (!this.pathShap) {
            this.pathShap = new egret.Shape();
            this.cellContainer.addChild(this.pathShap);
        } else {
            this.cellContainer.setChildIndex(this.pathShap, this.cellContainer.numChildren + 1);
        }
        this.drawSelectedCell();
    }

    private drawSelectedCell() {
        let row: number = -1;
        let col: number = -1;
        let nextRow: number = -1;
        let nextCol: number = -1;
        let startRow: number = -1;
        let startCol: number = -1;
        const lineArr = new Array<{ startRow: number, endRow: number, startCol: number, endCol: number }>();
        //  上一段线的防线，-1是没有方向，0是水平方向，1是垂直方向
        let lastDir = -1;
        for (let index = 0; index < this.selectedRowAndCol.length; index++) {
            row = this.selectedRowAndCol[index].row;
            col = this.selectedRowAndCol[index].col;
            if (index === 0) {
                startRow = row;
                startCol = col;
            }
            if (index < this.selectedRowAndCol.length - 1) {
                nextRow = this.selectedRowAndCol[index + 1].row;
                nextCol = this.selectedRowAndCol[index + 1].col;
                if (lastDir === -1) {
                    lastDir = nextRow === row ? 0 : 1;
                } else {
                    if (nextRow === row) {
                        // 这次是水平的，看看之前的方向
                        if (lastDir === 1) {
                            // 之前的是垂直的，那就算是得到了一个线段
                            lineArr.push({
                                startRow,
                                startCol,
                                endRow: row,
                                endCol: col,
                            });
                            startRow = row;
                            startCol = col;
                        }
                        lastDir = 0;
                    } else {
                        // 这是是垂直的了，
                        if (lastDir === 0) {
                            lineArr.push({
                                startRow,
                                startCol,
                                endRow: row,
                                endCol: col,
                            });
                            startRow = row;
                            startCol = col;
                        }
                        lastDir = 1;
                    }
                }
            } else {
                lineArr.push({
                    startRow,
                    startCol,
                    endRow: row,
                    endCol: col,
                });
            }
        }

        const gap = GameScene.GAP;
        const cellSize = GameScene.CELL_SIZE;
        const g = this.selectedCellShape.graphics;
        g.clear();
        g.beginFill(0x18cfdb);
        let minRow: number = 0;
        let minCol: number = 0;
        let maxRow: number = 0;
        let maxCol: number = 0;
        for (let index = 0; index < lineArr.length; index++) {
            let { startRow, startCol, endRow, endCol } = lineArr[index];
            if (startRow === endRow) {
                minRow = startRow;
                maxRow = endRow;
                // 水平画线
                if (startCol > endCol) {
                    minCol = endCol;
                    maxCol = startCol;
                } else {
                    minCol = startCol;
                    maxCol = endCol;
                }
            } else {
                minCol = startCol;
                maxCol = endCol;
                if (startRow > endRow) {
                    minRow = endRow;
                    maxRow = startRow;
                } else {
                    minRow = startRow;
                    maxRow = endRow;
                }
            }
            g.drawRoundRect(
                minCol * (cellSize + gap),
                minRow * (cellSize + gap),
                (maxCol - minCol) * gap + (maxCol - minCol + 1) * cellSize,
                (maxRow - minRow) * gap + (maxRow - minRow + 1) * cellSize,
                GameScene.CELL_ELLIPSE,
            );
        }
        g.endFill();

        // 判断是不是成功了
        const levelData: ILEVEL = this._levelJson[this.curLevel - 1];
        const rows = levelData.map.length;
        const cols = levelData.map[0].length;
        let exists: boolean = false;
        let success: boolean = true;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (levelData.map[row][col] > 0) {
                    exists = false;
                    for (let index = 0; index < this.selectedRowAndCol.length; index++) {
                        if (this.selectedRowAndCol[index].row === row) {
                            if (this.selectedRowAndCol[index].col === col) {
                                exists = true;
                                break;
                            }
                        }
                    }
                    if (!exists) {
                        // 只要有一个不在，那就是失败的
                        success = false;
                    }
                }
                if (!success) {
                    break;
                }
            }
            if (!success) {
                break;
            }
        }
        if (success) {
            // 成功了，跳到下一关
            utils.audio.play('success_mp3');
            this.pathShap.graphics.clear();
            const t: number = setTimeout(() => {
                clearTimeout(t);
                this.selectedCellShape.graphics.clear();
                for (let index = 0; index < this.cellArr.length; index++) {
                    for (let j = 0; j < this.cellArr[index].length; j++) {
                        this.cellArr[index][j].startToScale(index === 0 && j === 0 ? this.onCellEndScale : null, this);
                    }
                }
            }, 200);
        }
    }

    private onCellEndScale() {
        Service.passLevel().then(() => {
            const p = SuccessPanel.instance;
            p.show();
            // 重置重玩的次数
            LocalStorage.setItem(LocalStorageKey.leftReplayCount, 3);
            this.updateLeftReplayCount();

            if (!p.hasEventListener(GameEvent.NEXT_LEVEL)) {
                p.addEventListener(GameEvent.NEXT_LEVEL, this.onShowGetRedBagPanel, this);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    private onShowGetRedBagPanel() {
        // 判断是否有红包
        const levelData = this._levelJson[this.curLevel - 1];
        if (Array.isArray(levelData.redBag) && levelData.redBag.length === 2 && levelData.redBag[0] > 0) {
            const redBagPanel = NewRedBagPanel.instance;
            if (!redBagPanel.hasEventListener(GameEvent.GET_MONEY)) {
                redBagPanel.addEventListener(GameEvent.GET_MONEY, this.onShowGetRedBagAwardPanel, this);
            }
            redBagPanel.show();
        } else {
            // 没有红包，就跳到获得金币的面板
            this.onShowAwardPanel();
        }
    }

    private onShowGetRedBagAwardPanel() {
        const redBagAwardPanel = RedBagAward.instance;
        if (!redBagAwardPanel.hasEventListener(GameEvent.GET_MONEY_AWARD)) {
            redBagAwardPanel.addEventListener(GameEvent.GET_MONEY_AWARD, this.onShowAwardPanel, this);
        }
        const levelData = this._levelJson[this.curLevel - 1];
        Service.getRedBag(levelData.redBag[0], levelData.redBag[1]).then(({ data: { money } }) => {
            const curMoney = LocalStorage.getItem(LocalStorageKey.money);
            LocalStorage.setItem(LocalStorageKey.money, curMoney + money);
            redBagAwardPanel.setRedBagAward(money);
            redBagAwardPanel.show();
        }).catch(err => {
            console.error(err);
        });
    }

    private onShowAwardPanel() {
        // const awardPanel = AwardPanel.instance;
        // if (!awardPanel.hasEventListener(GameEvent.GET_AWARD)) {
        //     awardPanel.addEventListener(GameEvent.GET_AWARD, this.onUnlock, this);
        // }
        // awardPanel.show();
        this.onUnlock();
    }

    private onUnlock() {
        // const unlockPanel = UnlockPanel.instance;
        // if (!unlockPanel.hasEventListener(GameEvent.UNLOCK)) {
        //     unlockPanel.addEventListener(GameEvent.UNLOCK, this.onNextLevel, this);
        // }
        // unlockPanel.show();
        this.onNextLevel();
    }

    private onNextLevel() {
        LocalStorage.setItem(LocalStorageKey.curLevel, ++this.curLevel);
        if (this.curLevel > this._levelJson.length) {
            // 所有的关卡都通过了。。。
        } else {
            LocalStorage.setItem(LocalStorageKey.selectedRowAndCol, []);
            LocalStorage.saveToLocal();
            this.drawCell();
        }
    }

    private onTry2AddCell2Arr(evt: CellEvent) {
        const { row, col } = evt;
        const l = this.selectedRowAndCol.length;
        for (let index = 0; index < l; index++) {
            if (this.selectedRowAndCol[index].row === row) {
                if (this.selectedRowAndCol[index].col === col) {
                    // this.selectedRowAndCol.splice(index, l - index);
                    // this.selectedRowAndCol.push({ row, col });
                    // this.drawSelectedCell();
                    return;
                }
            }
        }
        // 添加的必须和上一个是连续的
        if (l > 0) {
            const lastRow = this.selectedRowAndCol[l - 1].row;
            const lastCol = this.selectedRowAndCol[l - 1].col;
            if (Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1) {
                this.selectedRowAndCol.push({ row, col });
                utils.audio.play('jo_mp3');
                LocalStorage.setItem(LocalStorageKey.selectedRowAndCol, this.selectedRowAndCol);
                this.drawSelectedCell();
            }
        }
    }

    private onAddCell2Arr(evt: CellEvent) {
        const { row, col } = evt;
        const l = this.selectedRowAndCol.length;
        // 添加的必须和上一个是连续的
        if (l > 0) {
            const lastRow = this.selectedRowAndCol[l - 1].row;
            const lastCol = this.selectedRowAndCol[l - 1].col;
            if (Math.abs(lastRow - row) + Math.abs(lastCol - col) !== 1) {
                return;
            }
        }
        for (let index = 0; index < l; index++) {
            if (this.selectedRowAndCol[index].row === row) {
                if (this.selectedRowAndCol[index].col === col) {
                    return;
                }
            }
        }
        this.selectedRowAndCol.push({ row, col });
        utils.audio.play('jo_mp3');
        LocalStorage.setItem(LocalStorageKey.selectedRowAndCol, this.selectedRowAndCol);
        this.drawSelectedCell();
    }

    private onBack() {
        LocalStorage.saveToLocal();
        this.dispatchEvent(new GameEvent(GameEvent.GO_TO_HOME));
    }

    private onReplay() {
        Service.tryReplay().then(({ data }) => {
            if (data) {
                this.doReplay();
            } else {
                // 次数不够
                Alert.instance.once(GameEvent.PAY_SUCCESS, this.doReplay, this);
                Alert.instance.show({
                    title: '获取提示',
                    content: '支付1元,获取重玩机会',
                    btnContent: '去支付',
                    eventAfterClose: GameEvent.PAY_SUCCESS,
                });
            }
        }).catch(err => {
            // ...
        });
    }

    private doReplay() {
        let leftReplayCount = parseInt(LocalStorage.getItem(LocalStorageKey.leftReplayCount));
        if (leftReplayCount > 0) {
            LocalStorage.setItem(LocalStorageKey.leftReplayCount, leftReplayCount - 1);
            this.updateLeftReplayCount();
        }
        this.pathShap.graphics.clear();
        this.selectedRowAndCol.length = 1;
        this.drawSelectedCell();
    }

    private onDollarTip() {
        Alert.instance.once(GameEvent.PAY_SUCCESS, this.onPaySuccess, this);
        Alert.instance.show({
            title: '获取提示',
            content: '支付1元,获取过关提示',
            btnContent: '去支付',
            eventAfterClose: GameEvent.PAY_SUCCESS,
        });
    }

    // 支付成功
    private onPaySuccess() {
        const path = utils.oneStroke.getPath(this._levelJson[this.curLevel - 1].map);
        // console.log(path);
        let lastP: utils.oneStroke.Point = null;
        let curP: utils.oneStroke.Point = null;
        let fromP: utils.oneStroke.Point = null;
        let endP: utils.oneStroke.Point = null;
        let cellSize = GameScene.CELL_SIZE;
        let gap = GameScene.GAP;
        const g = this.pathShap.graphics;
        g.clear();
        g.beginFill(0x18cfdb);
        for (let index = 1; index < path.length; index++) {
            lastP = path[index - 1];
            curP = path[index];
            if (lastP.row === curP.row) {
                if (lastP.col < curP.col) {
                    fromP = lastP;
                    endP = curP;
                } else {
                    fromP = curP;
                    endP = lastP;
                }
            } else {
                if (lastP.row < curP.row) {
                    fromP = lastP;
                    endP = curP;
                } else {
                    fromP = curP;
                    endP = lastP;
                }
            }
            g.drawRoundRect(
                fromP.col * (cellSize + gap) + cellSize / 2 - 10,
                fromP.row * (cellSize + gap) + cellSize / 2 - 10,
                (endP.col - fromP.col) * gap + (endP.col - fromP.col + 1) * cellSize - (cellSize - 20),
                (endP.row - fromP.row) * gap + (endP.row - fromP.row + 1) * cellSize - (cellSize - 20),
                10,
            );
        }
        g.endFill();
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