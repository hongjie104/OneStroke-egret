//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    private _gameContainer: egret.DisplayObjectContainer;

    private _levelJson: Array<Array<Array<number>>>;

    private _redBagJson: { name: Array<string>, money: Array<number> };

    private homeScene: HomeScene;

    private gameScene: GameScene;

    private _curScene: egret.DisplayObjectContainer;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        // 添加一个白色的背景
        const bg = new egret.Shape();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {
            };
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        };

        this.runGame().catch(e => {
            console.log(e);
        });
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    // private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        LocalStorage.init();
        // 初始化UI
        const ui = UI.instance;
        ui.stageWidth = this.stage.stageWidth;
        ui.stageHeight = this.stage.stageHeight;
        fairygui.UIPackage.addPackage("ui_bin");
        fairygui.UIConfig.defaultFont = "宋体";

        this._levelJson = RES.getRes("level_json");
        this._redBagJson = RES.getRes("redBag_json");

        this._gameContainer = new egret.DisplayObjectContainer();
        this.addChild(this._gameContainer);

        this.addChild(fairygui.GRoot.inst.displayObject);

        this.showHomeScene();
    }

    private showHomeScene() {
        this.removeCurScene();
        if (!this.homeScene) {
            this.homeScene = new HomeScene(this._redBagJson);
            this.homeScene.addEventListener(GameEvent.START_GAME, this.showGameScene, this);
        }
        this._curScene = this.homeScene;
        this._gameContainer.addChild(this.homeScene);
    }

    private showGameScene() {
        this.removeCurScene();
        if (!this.gameScene) {
            this.gameScene = new GameScene(this._levelJson, this._redBagJson);
            this.gameScene.addEventListener(GameEvent.GO_TO_HOME, this.showHomeScene, this);
        }
        this._curScene = this.gameScene;
        this._gameContainer.addChild(this.gameScene);
    }

    private removeCurScene() {
        if (this._curScene && this._curScene.parent === this._gameContainer) {
            this._gameContainer.removeChild(this._curScene);
        }
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    // private startAnimation(result: string[]) {
    //     let parser = new egret.HtmlTextParser();

    //     let textflowArr = result.map(text => parser.parse(text));
    //     let textfield = this.textfield;
    //     let count = -1;
    //     let change = () => {
    //         count++;
    //         if (count >= textflowArr.length) {
    //             count = 0;
    //         }
    //         let textFlow = textflowArr[count];

    //         // 切换描述内容
    //         // Switch to described content
    //         textfield.textFlow = textFlow;
    //         let tw = egret.Tween.get(textfield);
    //         tw.to({ "alpha": 1 }, 200);
    //         tw.wait(2000);
    //         tw.to({ "alpha": 0 }, 200);
    //         tw.call(change, this);
    //     };

    //     change();
    // }
}