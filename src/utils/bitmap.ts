module utils.bitmap {
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    export function create(name: string) {
        const result = new egret.Bitmap();
        result.texture = RES.getRes(name);
        return result;
    }
}
