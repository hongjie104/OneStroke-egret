class Net {

    private static _instance: Net;

    public constructor() {

    }

    getData(url: string) {
        return new Promise((resolve, reject) => {
            const request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.setRequestHeader("Content-Type", "application/json");
            request.once(egret.Event.COMPLETE, () => {
                resolve(JSON.parse(request.response));
            }, this);
            request.once(egret.IOErrorEvent.IO_ERROR, () => {
                reject();
            }, this);
            request.open(url, egret.HttpMethod.GET);
            request.send();
        });
    }

    postData(url: string, data: any, method: string = egret.HttpMethod.POST) {
        return new Promise((resolve, reject) => {
            const request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.setRequestHeader("Content-Type", "application/json");
            request.once(egret.Event.COMPLETE, () => {
                resolve(JSON.parse(request.response));
            }, this);
            request.once(egret.IOErrorEvent.IO_ERROR, () => {
                reject();
            }, this);
            request.open(url, method);
            request.send(JSON.stringify(data));
        });
    }

    static get instance(): Net {
        if (!Net._instance) {
            Net._instance = new Net();
        }
        return Net._instance;
    }
}
