class GameEvent extends egret.Event {

    public static START_GAME: string = 'startGame';

    public static GO_TO_HOME: string = 'goToHome';

    public static NEXT_LEVEL: string = 'nextLevel';

    constructor(type: string) {
        super(type);
    }
}