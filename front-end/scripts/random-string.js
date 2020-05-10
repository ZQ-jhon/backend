export const randomString = (len) => {
    len = len || 10;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let randomString = '';
    for (let i = 0; i < len; i++) {
        randomString += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomString;
}