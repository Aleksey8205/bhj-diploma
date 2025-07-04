const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();

    let { url = '', method = 'GET', data = {}, callback = () => {} } = options;
    if (!url) return;

    xhr.responseType = 'json';

    let formData = null;

    if (method !== 'GET') {
        formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
    }

    if (method === 'GET') {
        let searchParams = new URLSearchParams(data);
        url += (url.includes('?') ? '&' : '?') + searchParams.toString();
    }

    xhr.onload = function() {
        callback(null, this.response);
    };

    xhr.onerror = function() {
        callback(new Error('Ошибка соединения с сервером'), null);
    };

    try {
        xhr.open(method, url);
        xhr.send(formData);
    } catch (err) {
        callback(err, null);
        console.error(err);
    }
};