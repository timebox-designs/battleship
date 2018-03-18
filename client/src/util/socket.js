// see https://github.com/balderdashy/sails.io.js#requirejsamd-usage

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

const io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';

const errorCodes = [400, 404, 500];
const match = (first) => (second) => first === second;

const request = (options) => {
    return new Promise((resolve, reject) => {
        io.socket.request(options, (data, jwr) => {
            if (errorCodes.some(match(jwr.statusCode))) return reject(jwr.statusCode);
            return resolve(data);
        });
    });
};

const socket = {
    post: (url, data) => request({method: 'POST', url, data}),
    put: (url, data) => request({method: 'PUT', url, data}),
    get: (url, data) => request({method: 'GET', url, data}),
    on: (event, msg) => io.socket.on(event, msg)
};

export default socket;