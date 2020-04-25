export const randomString = (len) => {
    len = len || 10;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var randomString = '';
    for (let i = 0; i < len; i++) {
        randomString += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomString;
}