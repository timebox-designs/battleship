// see https://github.com/balderdashy/sails.io.js#requirejsamd-usage

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

let io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';

const errorCodes = [400, 404, 500];
const match = (first) => (second) => first === second;

const socket = {
    get(url, options = {}) {
        return new Promise((resolve, reject) => {
            io.socket.get(url, options, (data, jwr) => {
                // console.log('get', data, jwr);
                if (errorCodes.some(match(jwr.statusCode))) return reject(jwr.statusCode);
                return resolve(data);
            });
        });
    },

    post(url, options = {}) {
        return new Promise((resolve, reject) => {
            io.socket.post(url, options, (data, jwr) => {
                // console.log('post', data, jwr);
                if (errorCodes.some(match(jwr.statusCode))) return reject(jwr.statusCode);
                return resolve(data);
            });
        });
    },

    on(event, msg) {
        return io.socket.on(event, msg);
    }
};

export default socket;