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
            let userModel = mongoose.model('User');
            
            return Promise.resolve({})
                .then(() => {
                    if (err) throw err;
                })
                .then(() => {
                    //Todo:Verify Date
                    return userModel.getUserById(data.id)
                        .then((user) => {
                            if (!user) throw new Error();
                            socket.verified = true;
                            socket.authToken = socket.token = token;
                            socket.userId = data.id;
                            socket.emit("authenticated");
                        })
                        .then(() => cb(socket));
                })
                .catch((e) => {
                    console.log(e);
                    socket.emit("unauthorised");
                    socket.disconnect();
                });
        });
    });
    setTimeout(() => {
        if (socket && !socket.verified) {
            socket.emit("unauthorised");
            socket.disconnect();
        }
    }, 15000);
};

device.on('connection', (socket) => auth(socket, (socket) => {
    let deviceModel = mongoose.model('Device');
    
    socket.on('disconnect', () => {
        activeUsers.offlineDevice(socket);
        //TOdo:Check
        return deviceModel.getDeviceById(socket.deviceId)
            .then((device) => {
                return deviceModel.updateLastSeen(device);
            });
    });
    
    return deviceModel.getDeviceByToken(socket.authToken)
        .then((device) => {
            socket.deviceId = device._id;
            registerDeviceEvents(socket);
            return activeUsers.liveDevice(socket.userId, socket.deviceId, socket);
        });
}));

client.on('connection', (socket) => auth(socket, (socket) => {
    socket.on('disconnect', () => activeUsers.offlineUser(socket));
    registerClientEvents(socket);
    return activeUsers.addClient(socket.userId, socket);
}));

const registerClientEvents = (socket) => {
    socket.on('getDevices', (ack) => {
        let deviceModel = mongoose.model('Device');
        let data = [];
        return deviceModel.getDeviceByUser(socket.userId)
            .then((devices) => {
                for (let x = 0; x < devices.length; x++) {
                    let dJson = devices[ x ].toJSON();
                    dJson.Id = devices[ x ]._id;
                    data.push(dJson);
                }
                ack(data);
            });
    });
    
    socket.on('getLive', (ack) => {
        ack(activeUsers.getLiveDevice(socket.userId));
    });
    
    socket.on('root', (deviceId, ack) => {
        let deviceSocket = activeUsers.getDeviceSocket(socket.userId, deviceId);
        if (deviceSocket) {
            deviceSocket.emit('root', (files) => {
                ack(JSON.parse(files));
            });
        }
    });
    
    socket.on('path', (deviceId, path, ack) => {
        let deviceSocket = activeUsers.getDeviceSocket(socket.userId, deviceId);
        if (deviceSocket) {
            deviceSocket.emit('path', path, (files) => {
                ack(JSON.parse(files));
            });
        }
    });
};

const registerDeviceEvents = (socket) => {
};

module.exports = (app) => {
    io.serveClient(true);
    io.attach(app);
};