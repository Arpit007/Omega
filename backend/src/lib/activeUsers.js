/**
 * Created by StarkX on 16-Apr-18.
 */

class ActiveUsers {
    constructor() {
        this.list = {};
    }
    
    getUser(id) {
        if (!(id in this.list))
            this.list[ id ] = { clients : [], devices : [] };
        return this.list[ id ];
    }
    
    addDevice(user, device) {
        user = this.getUser(user._id);
        user[ 'clients' ].forEach((client) => client.emit('addDevice', device.toJSON()));
    }
    
    liveDevice(userId, deviceId, socket) {
        socket.userId = userId;
        let user = this.getUser(userId);
        socket.deviceId = deviceId;
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
        socket.userId = user._id;
        user = this.getUser(socket.userId);
        if (!user[ 'clients' ].includes(socket))
            user[ 'clients' ].push(socket);
    }
    
    offlineUser(socket) {
        user = this.getUser(socket.userId);
        if (!user[ 'clients' ].includes(socket))
            return;
        user[ 'clients' ].splice(user[ 'clients' ].indexOf(socket), 1);
        if (user[ 'clients' ].length === 0 && user[ 'devices' ].length === 0)
            delete this.list[ socket.userId ];
    }
}

const activeUsers = module.exports = new ActiveUsers();