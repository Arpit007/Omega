/**
 * Created by StarkX on 09-Mar-18.
 */

module.exports = global.Model = {
    User : require('./controller/user'),
    Download : require('./controller/download'),
    File : require('./controller/file'),
    Device : require('./controller/device')
};