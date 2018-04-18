/**
 * Created by StarkX on 18-Apr-18.
 */
define(function (require) {
    const setExtension = (file) => {
        for (let name in file.files) {
            cFile = file.files[ name ];
            if (cFile.isFolder) continue;
            cFile.ext = cFile.name.substring(cFile.name.lastIndexOf('.' + 1));
        }
    };
    
    class Buffer {
        constructor() {
            this.current = null;
            this.buffer = null;
            this.operation = null;
        }
        
        reset() {
            this.current = null;
            this.buffer = null;
            this.operation = null;
        }
        
        selectFile(file) {
            this.current = file;
        }
        
        copyFile(file) {
            this.buffer = file;
            this.operation = 'copy';
        }
        
        cutFile(file) {
            this.buffer = file;
            this.operation = 'cut';
        }
        
        currentFile() {
            return this.current;
        }
        
        bufferFile() {
            return this.buffer;
        }
        
        isBufferEmpty() {
            return this.buffer == null;
        }
    }
    
    class FileExplorer {
        constructor() {
            this.buffer = new Buffer();
            this.current = null;
            this.queue = [];
        }
        
        isEmpty() {
            return this.queue.length === 0;
        }
        
        isRoot() {
            return this.queue.length === 1;
        }
        
        goUp() {
            if (!this.isEmpty() && !this.isRoot()) {
                this.queue.pop();
                this.current = this.queue[ this.queue.length - 1 ];
                this.update();
            }
        }
        
        setRoot(deviceRoot) {
            this.reset();
            setExtension(deviceRoot);
            this.current = deviceRoot;
            this.queue = [ deviceRoot ];
            this.update();
        }
        
        addPath(file) {
            setExtension(file);
            this.queue.push(file);
            this.current = file;
            this.update();
        }
        
        setPath(file) {
            this.queue = [ file ];
            this.current = file;
            this.update();
        }
        
        reset() {
            this.queue = [];
            this.current = null;
        }
        
        update() {
            //Todo: Add to DOM
        }
        
        getBuffer() {
            return this.buffer;
        }
    }
    
    class DeviceList {
        constructor() {
            this.deviceList = {};
            this.current = null;
            this.explorer = new FileExplorer();
        }
        
        getExplorer() {
            return this.explorer;
        }
        
        addDevice(device) {
            device.status = 'offline';
            if (device.Id in this.deviceList) return;
            this.deviceList[ device.Id ] = device;
            this.singleSetup(device);
        }
        
        removeDevice(deviceId) {
            if (deviceId in this.deviceList) {
                delete this.deviceList[ deviceId ];
                $(`#menuHolder${deviceId}`).remove();
            }
        }
        
        liveDevice(deviceId) {
            this.deviceList[ deviceId ].status = 'live';
            let temp = `#status${deviceId}`;
            let status = $(temp);
            status.removeClass('offline');
            status.addClass('live');
        }
        
        offlineDevice(deviceId) {
            this.deviceList[ deviceId ].status = 'offline';
            let status = $(`#status${deviceId}`);
            status.addClass('offline');
            status.removeClass('live');
        }
        
        isDeviceSelected() {
            return this.current != null;
        }
        
        singleSetup(device) {
            let index = device.Id;
            let holder = $('#__genericHolder__').clone();
            holder.attr("id", `menuHolder${index}`);
            holder.attr("deviceId", device.Id);
            
            let anchor = holder.children(':first-child');
            anchor.attr('href', `#menu${index}`);
            let status = anchor.children('#__genericStatus__');
            status.attr("id", `status${index}`);
            anchor.html(anchor.html().replace("__genericName__", device.name));
            
            let menu = holder.children('#__genericMenu__');
            let pin = menu.children(':first-child').clone();
            anchor = menu.children(':nth-child(2)').clone();
            let submenu = menu.children(':nth-child(3)').clone();
            let down = submenu.children(':first-child').clone();
            menu.children().remove();
            submenu.children().remove();
            
            menu.attr("id", `menu${index}`);
            pin.attr('data-parent', `menu${index}`);
            for (let file of device.pin) {
                let tPin = pin.clone();
                tPin.attr('path', file.path);
                tPin.text(file.name);
                menu.append(tPin);
            }
            
            anchor.attr("href", `#submenu${index}`);
            menu.append(anchor);
            
            submenu.attr("id", `submenu${index}`);
            menu.append(submenu);
            
            down.attr('data-parent', `submenu${index}`);
            for (let file of device.download) {
                let tDown = down.clone();
                tDown.attr('path', file.path);
                tDown.text(file.name);
                submenu.append(tDown);
            }
            $('#menuPanel').append(holder);
        }
        
        reset() {
            this.deviceList = {};
            this.current = null;
            this.getExplorer().reset();
            
            $('#menuPanel').children().remove();
        }
        
        setDevice(deviceId){
            this.current = this.deviceList[deviceId];
        }
        
        isCurrent(deviceId) {
            return this.current != null && this.current.Id === deviceId;
        }
    }
    
    return DeviceList;
});