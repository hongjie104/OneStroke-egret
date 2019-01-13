module utils.audio {

    export function play(audio: string, loops: number = 1): void {
        if(LocalStorage.getItem(LocalStorageKey.soundEnabled)) {
            const sound: egret.Sound = RES.getRes(audio);
            if (sound) {
                sound.play(0, loops);
            }
        }
    }
}