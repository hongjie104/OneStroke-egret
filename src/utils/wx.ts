module utils.wechat {
    export function init(noncestr, timestamp, signature) {
        return new Promise((resolve, reject) => {
            const bodyConfig: BodyConfig = new BodyConfig();
            bodyConfig.appId = "wxc32a98e6039c198f";
            bodyConfig.nonceStr = noncestr;
            bodyConfig.timestamp = timestamp;
            bodyConfig.signature = signature;
            bodyConfig.jsApiList = [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'getNetworkType',
            ];
            bodyConfig.debug = false;
            // 通过config接口注入权限验证配置
            if (wx) {
                wx.config(bodyConfig);
                wx.ready(() => {
                    const bodyMenuShareAppMessage = new BodyMenuShareAppMessage();
                    bodyMenuShareAppMessage.title = 'this is title';
                    bodyMenuShareAppMessage.desc = 'this is desc';
                    // bodyMenuShareAppMessage.imgUrl =
                    wx.onMenuShareAppMessage(bodyMenuShareAppMessage)
                    resolve();
                });
                wx.error(() => {
                    reject();
                });
            } else {
                reject();
            }
        });
    }

    // export function tt() {
    //     // {
    //     //     title: '', // 分享标题
    //     //         desc: '', // 分享描述
    //     //             link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     //                 imgUrl: '', // 分享图标
    //     //                     success: function () {
    //     //                         // 设置成功
    //     //                     },
    //     // }
    //     BodyMenuShareAppMessage
    //     wx.onMenuShareAppMessage();
    // }
}