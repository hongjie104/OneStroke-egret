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
                const randomArr = [
                    {
                        title: '邀请你来玩游戏 领大红包',
                        desc: '玩游戏 每过一关即可领一定的红包。',
                    },
                    {
                        title: '惊！可以赚钱的游戏',
                        desc: '每一过关可以获取红包，快快来赚钱！',
                    },
                    {
                        title: '我在这款游戏里赚三百多',
                        desc: '这款游戏每过一关就可以领取红。大家快点来赚钱',
                    },
                    {
                        title: '大哥快点为领红包',
                        desc: '这里的玩游戏 还可领红包快点来，马上就要关了！',
                    },
                    {
                        title: '小妹快点为领红包',
                        desc: '这里的玩游戏 还可领红包快点来，马上就要关了！',
                    },
                    {
                        title: '嫂子快点来领红包',
                        desc: '这里的玩游戏 还可领红包快点来，马上就要关了！',
                    },
                ];
                const state = parseInt(locationUtil.getParamValue('state'));
                wx.config(bodyConfig);
                wx.ready(() => {
                    const bodyMenuShareAppMessage = new BodyMenuShareAppMessage();
                    bodyMenuShareAppMessage.title = randomArr[state - 1].title;
                    bodyMenuShareAppMessage.desc = randomArr[state - 1].desc;
                    bodyMenuShareAppMessage.imgUrl = 'https://www.bidapei.com/redbag.jpg';
                    // bodyMenuShareAppMessage.link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc32a98e6039c198f&redirect_uri=https%3A%2F%2Fwww.bidapei.com&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
                    bodyMenuShareAppMessage.link = `https://www.bidapei.com/server/api/user/redirect/${state}`;
                    wx.onMenuShareAppMessage(bodyMenuShareAppMessage);
                    utils.audio.play('jo_mp3');
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