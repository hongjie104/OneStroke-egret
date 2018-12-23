module utils.locationUtil {

    export function getParamValue(paraName: string, paraUrl?: string): string {
        if (egret.Capabilities.runtimeType === egret.RuntimeType.WEB) {
            var url = paraUrl || location.href;
            if (url.indexOf("?") != -1) {
                var urlPara = "&" + url.split("?")[1];
                var reg = new RegExp("\&" + paraName + "\=.*?(?:\&|$)");
                var result = reg.exec(urlPara);
                if (result) {
                    var value: string = result[0];
                    return value.split("&")[1].split("=")[1];
                }
            }
        }
        return null;
    };

}