module Service {

    const HOST = 'https://www.bidapei.com/server';

    export function login(code: string): Promise<any> {
        return Net.instance.postData(`${HOST}/api/user/login`, { code } );
    }

    export function sing(url: string): Promise<any> {
        return Net.instance.postData(`${HOST}/sign`, { url });
    }
}
