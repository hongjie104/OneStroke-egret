class GameEvent extends egret.Event {

    public static START_GAME: string = 'startGame';

    public static GO_TO_HOME: string = 'goToHome';

    public static NEXT_LEVEL: string = 'nextLevel';

    public static GET_AWARD: string = 'getAward';

    public static UNLOCK: string = 'unlockLevel';

    public static GET_MONEY: string = 'getMoney';

    public static GET_MONEY_AWARD: string = 'getMoneyAward';

    constructor(type: string) {
        super(type);
    }
}