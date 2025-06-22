const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();

    let url = options.url || '';
    if (!url) return;

    let method = options.method || 'GET';
    let data = options.data || {};
    let callback = options.callback || (() => {});
    let headers = options.headers || {};
    xhr.responseType = 'json';

    let formData = "";

    try {
        if (method === 'GET') {
            let searchParams = new URLSearchParams(data);
            url += (url.includes('?') ? '&' : '?') + searchParams.toString();
        } else if (['POST', 'PUT'].includes(method)) {
            formData = new FormData();
            for (let key in data) {
                formData.append(key, data[key]);
                
            }
        }

        xhr.open(method, url);

        Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                try {
                    let parsedResponse = this.response;
                    callback(null, parsedResponse);
                } catch (e) {
                    callback(e, null);
                }
            } else {
                callback(new Error(`HTTP error ${this.status}: ${this.statusText}`), null);
            }
        };

        xhr.onerror = function () {
            callback(new Error('Нет подключения к серверу'), null);
        };

        if (method === 'GET' || method === 'DELETE') {
            xhr.send();
        } else {
            xhr.send(formData);
        }
    } catch (err) {
        callback(err, null);
        console.log(err);
    }
};