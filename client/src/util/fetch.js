export default {
    post: (url, data = {}) => {
        return fetch(url, {
            body: JSON.stringify(data),
            method: 'POST'
        }).then(response => response.json())
    }
};
