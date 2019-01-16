module utils.audio {

    export function play(audio: string, loops: number = 1): void {
        if(LocalStorage.getItem(LocalStorageKey.soundEnabled)) {
            const sound: egret.Sound = RES.getRes(audio);
            if (sound) {
                try {
                    sound.play(0, loops);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
}