/**
 * Created by StarkX on 18-Apr-18.
 */
define(function (require) {
    const audio = [ "aif", "cda", "mid", "midi", "mp3", "mpa", "ogg", "wav", "wma", "wpl" ];
    const archive = [ "7z", "arj", "deb", "pkg", "rar", "rpm", "gz", "z", "zip" ];
    const disk = [ "bin", "dmg", "iso", "toast", "vcd" ];
    const code = [ "csv", "dat", "db", "log", "mdb", "sav", "sql", "tar", "xml", "c", "class", "cpp", "cs", "h", "java", "sh", "swift", "vb" ];
    const exec = [ "apk", "bat", "bin", "cgi", "pl", "com", "exe", "gadget", "jar", "py", "wsf" ];
    const img = [ "ai", "bmp", "gif", "ico", "jpeg", "jpg", "png", "ps", "psd", "svg", "tif", "tiff" ];
    const web = [ "asp", "cer", "cfm", "cgi", "pl", "css", "html", "htm", "js", "jsp", "part", "php", "py", "rss", "xhtml" ];
    const presentation = [ "key", "odp", "pps", "ppt", "pptx" ];
    const spreadsheet = [ "ods", "xlr", "xls", "xlsx" ];
    const system = [ "bak", "cab", "cfg", "cpl", "cur", "dll", "dmp", "drv", "icns", "ico", "ini", "lnk", "msi", "sys", "tmp" ];
    const video = [ "3g2", "3gp", "avi", "flv", "h264", "m4v", "mkv", "mov", "mp4", "mpg", "mpeg", "rm", "swf", "vob", "wmv" ];
    const word = [ "doc", "docx", "odt", "rtf", "tex", "txt", "wks", "wps", "wpd" ];
    const pdf = [ "pdf" ];
    
    const setExtension = (file) => {
        let files = file.files;
        for (let tag in files) {
            if (files[ tag ].isFolder) files[ tag ].ext = "";
            else files[ tag ].ext = files[ tag ].name.substring(files[ tag ].name.lastIndexOf('.') + 1);
        }
    };
    
    const getClass = (file) => {
        let ext = file.ext;
        if (file.isFolder) return "fa-folder folder";
        if (audio.includes(ext)) return "fa-file-audio audio";
        if (archive.includes(ext)) return "fa-file-archive archive";
        if (disk.includes(ext)) return "fa-dot-circle dvd";
        if (code.includes(ext)) return "fa-file-code code";
        if (exec.includes(ext)) return "fa-sticky-note note";
        if (img.includes(ext)) return "fa-file-image image";
        if (web.includes(ext)) return "fa-globe web";
        if (presentation.includes(ext)) return "fa-file-powerpoint power";
        if (spreadsheet.includes(ext)) return "fa-file-excel spread";
        if (system.includes(ext)) return "fa-cogs cog";
        if (video.includes(ext)) return "fa-file-video vid";
        if (word.includes(ext)) return "fa-file-word word";
        if (pdf.includes(ext)) return "fa-file-pdf pdf";
        return "fa-file file";
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
            this.mode = localStorage.mode || 'none';
            this.queue = [];
        }
        
        setMode(mode) {
            if (this.mode !== mode) {
                this.mode = mode;
                localStorage.mode = mode;
                this.update();
            }
        }
        
        * fileIterator() {
            let dict = {}, queue = [];
            for (let path in this.current.files) {
                dict[ this.current.files[ path ].name ] = path;
                queue.push(this.current.files[ path ].name);
            }
            if (this.mode !== 'none') {
                queue.sort();
                if (this.mode === 'desc')
                    queue.reverse();
            }
            for (let item of queue)
                yield this.current.files[ dict[ item ] ];
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
        
        refresh(file) {
            this.queue.pop();
            this.queue.push(file);
            this.current = file;
            this.update();
        }
        
        update() {
            let files = $('#files');
            files.children().remove();
            if (this.current == null) return;
            
            let temp = $('#templateFile').html();
            for (let file of this.fileIterator()) {
                let html = new String(temp);
                html = html.replace("__genericPath__", file.path)
                    .replace("__genericClass__", getClass(file))
                    .replace("__genericFileName__", file.name);
                files.append($($.parseHTML(html)));
            }
        }
        
        canExplore(path) {
            if (this.current == null) return false;
            return (path in this.current.files && this.current.files[ path ].isFolder);
        }
        
        goToRoot() {
            if (this.queue.size < 1) return;
            this.queue.splice(1);
            this.current = this.queue[ 0 ];
            this.update();
        }
        
        getCurrent() {
            return this.current;
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
        
        setDevice(deviceId) {
            this.current = this.deviceList[ deviceId ];
        }
        
        isCurrent(deviceId) {
            return this.current != null && this.current.Id === deviceId;
        }
    }
    
    return DeviceList;
});