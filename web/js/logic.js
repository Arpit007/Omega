/**
 * Created by StarkX on 16-Apr-18.
 */
define(function (require) {
    const DeviceList = new require('./deviceList');
    const deviceList = new DeviceList();
    
    let socket;
    let loader, root, up, del, cut, copy,
        paste, file, folder, upload, download,
        filterAsc, filterDsc, pin;
    
    $(() => {
        loader = $('#loader');
        root = $('#root');
        up = $('#up');
        del = $('#del');
        cut = $('#cut');
        copy = $('#copy');
        paste = $('#paste');
        file = $('#file');
        folder = $('#folder');
        upload = $('#upload');
        download = $('#download');
        filterAsc = $('#filterAsc');
        filterDsc = $('#filterDsc');
        pin = $('#pin');
        
        socket = io.connect('/client');
        
        socket.on('connect', () => {
            socket.on('authenticate', (ack) => {
                let data = { 'auth-token' : localStorage.authToken };
                ack(data);
            });
            socket.on('authenticated', () => {
                console.log('Authenticated');
                registerEvents(socket);
            });
            socket.on('unauthorised', () => {
                console.log('UnAuthenticated');
                //$('#logout').trigger("click");
            });
        });
    });
    
    const registerEvents = (socket) => {
        socket.emit('getDevices', (devices) => {
            deviceList.reset();
            for (let device of devices) {
                deviceList.addDevice(device);
            }
            socket.emit('getLive', (devices) => {
                for (let deviceId of devices)
                    deviceList.liveDevice(deviceId);
            });
        });
        
        socket.on('addDevice', (device) => {
            deviceList.addDevice(device);
        });
        
        socket.on('liveDevice', (obj) => {
            deviceList.liveDevice(obj.Id);
        });
        
        socket.on('offlineDevice', (obj) => {
            deviceList.offlineDevice(obj.Id);
        });
        
        
        $('#menuPanel').on('click', '.menuLabel', function () {
            let deviceId = $(this).attr("deviceId");
            if (!deviceList.isCurrent(deviceId)) {
                socket.emit('root', deviceId, (files) => {
                    deviceList.setDevice(deviceId);
                    deviceList.explorer.setRoot(files);
                });
            }
        });
    };
});