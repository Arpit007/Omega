/**
 * Created by StarkX on 18-Apr-18.
 */
const io = new require('socket.io')();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const activeUsers = require('./activeUsers');

const client = io.of('/client');
const device = io.of('/device');

const auth = (socket, cb) => {
    socket.verified = false;
    socket.emit('authenticate', (data) => {
        token = data[ 'auth-token' ];
        jwt.verify(token, xConfig[ 'crypto' ].JwtKey, (err, data) => {
            if (err) {
                socket.emit("unauthorised");
                socket.disconnect();
            } else {
                socket.verified = true;
                socket.authToken = socket.token = token;
                socket.userId = data.id;
                socket.emit("authenticated");
                cb(socket);
            }
        });
    });
};

device.on('connection', (socket) => auth(socket, (socket) => {
    let deviceModel = mongoose.model('Device');
    
    socket.on('disconnect', () => activeUsers.offlineDevice(socket));
    
    return deviceModel.getDeviceByToken(socket.authToken)
        .then((device) => {
            socket.deviceId = device._id;
            return activeUsers.liveDevice(socket.userId, socket.deviceId, socket);
        });
}));

client.on('connection', (socket) => auth(socket, (socket) => {
    socket.on('disconnect', () => activeUsers.offlineUser(socket));
    return activeUsers.addClient(socket.userId, socket);
}));


module.exports = (app) => {
    io.serveClient(false);
    io.attach(app);
};