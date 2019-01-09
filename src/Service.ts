module Service {

    const HOST = 'https://www.bidapei.com/server';

    export function login(code: string): Promise<any> {
        return Net.instance.postData(`${HOST}/api/user/login`, { code } );
    }

    export function sing(url: string): Promise<any> {
        return Net.instance.postData(`${HOST}/sign`, { url });
    }

    export function passLevel() {
        return Net.instance.getData(`${HOST}/api/user/pass_level`);
    }

    export function getRedBag(minVal: number, maxVal: number): Promise<any> {
        return Net.instance.postData(`${HOST}/api/user/get_red_bag`, { minVal, maxVal });
    }

    export function tryReplay(): Promise<any> {
        return Net.instance.getData(`${HOST}/api/user/replay`);
    }
}
