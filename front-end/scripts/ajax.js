export function ajax(option) {
    let body = option.body || null;
    if (option.body) {
        if (Object.prototype.toString.call(body) !== '[object Object]') {
            throw new TypeError(`${body} is not a object to use in JSON.parse()!`);
        }
        body = JSON.stringify(option.body);
    }
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open(option.method, option.url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (Math.floor(xhr.status / 200) === 1) {
                    res(option.success(xhr.response));
                } else {
                    rej(option.error(xhr.response));
                }
            }
        }
    });
}