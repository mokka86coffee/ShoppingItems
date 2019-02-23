export function crossBrowserFetch (url, optionObj = { method: 'GET', body: undefined }, JSONparsing = true) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open(optionObj.method, url);

        if (optionObj.headers) {
            for (let key in optionObj.headers) {
                req.setRequestHeader(key, optionObj.headers[key]);
            }
        }

        req.onload = () => {
            if (req.status === 200) {
                if (JSONparsing) {
                    resolve(JSON.parse(req.response));
                } else {
                    resolve(req.response);
                }
            } else {
                reject(Error(req.statusText));
            }
        };

        req.send(optionObj.body);
    })
}