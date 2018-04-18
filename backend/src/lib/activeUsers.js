/**
 * Created by StarkX on 16-Apr-18.
 */

class ActiveUsers {
    constructor() {
        this.list = {};
    }
    
    getUser(id) {
        if (!(id in this.list))
        //Todo:Make dictionary
            this.list[ id ] = { clients : [], devices : [] };
        return this.list[ id ];
    }
    
    addDevice(user, device) {
        user = this.getUser(user._id);
        let temp = device.toJSON();
        temp.Id = device.Id;
        user[ 'clients' ].forEach((client) => client.emit('addDevice', temp));
    }
    
    liveDevice(userId, deviceId, socket) {
        socket.userId = String(userId);
        let user = this.getUser(userId);
        socket.deviceId = String(deviceId);
        user[ 'devices' ].push(socket);
        user[ 'clients' ].forEach((client) => client.emit('liveDevice', { Id : socket.deviceId }));
    }
    
    offlineDevice(socket) {
        let user = this.getUser(socket.userId);
        if (!user[ 'devices' ].includes(socket))
            return;
        user[ 'devices' ].splice(user[ 'devices' ].indexOf(socket), 1);
        user[ 'clients' ].forEach((client) => client.emit('offlineDevice', { Id : socket.deviceId }));
        if (user[ 'clients' ].length === 0 && user[ 'devices' ].length === 0)
            delete this.list[ socket.userId ];
    }
    
    addClient(userId, socket) {
        socket.userId = String(userId);
        let user = this.getUser(socket.userId);
        if (!user[ 'clients' ].includes(socket))
            user[ 'clients' ].push(socket);
    }
    
    offlineUser(socket) {
        let user = this.getUser(socket.userId);
        if (!user[ 'clients' ].includes(socket))
            return;
        user[ 'clients' ].splice(user[ 'clients' ].indexOf(socket), 1);
        if (user[ 'clients' ].length === 0 && user[ 'devices' ].length === 0)
            delete this.list[ socket.userId ];
    }
    
    getLiveDevice(userId) {
        let list = [];
        let user = this.getUser(userId);
        for (let device of user.devices)
            list.push(device.deviceId);
        return list;
    }
    
    getDeviceSocket(userId, deviceId) {
        let user = this.getUser(userId);
        for (let socket of user.devices) {
            if (socket.deviceId === deviceId)
                return socket;
        }
    }
    
    //TOdo: Logout
}

module.exports = new ActiveUsers();