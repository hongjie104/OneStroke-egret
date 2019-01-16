enum LocalStorageKey {
    uid, money, curLevel, leftReplayCount, selectedRowAndCol, soundEnabled,
}

class LocalStorage {

    public static localStorageData: Array<any>;

    private static _isInited = false;

    static init() {
        if (!LocalStorage._isInited) {
            LocalStorage._isInited = true;
            const s = egret.localStorage.getItem('oneStroke');
            if (!s) {
                LocalStorage.localStorageData = ['', 0, 1, 3, [], true];
            } else {
                LocalStorage.localStorageData = JSON.parse(s);
            }
        }
    }

    static getItem(key: LocalStorageKey): any {
        return LocalStorage.localStorageData[key];
    }

    static setItem(key: LocalStorageKey, val: any): void {
        LocalStorage.localStorageData[key] = val;
    }

    static saveToLocal(): void {
        egret.localStorage.setItem('oneStroke', JSON.stringify(LocalStorage.localStorageData));
    }

    static clear(): void {
        egret.localStorage.removeItem('oneStroke');
    }

}