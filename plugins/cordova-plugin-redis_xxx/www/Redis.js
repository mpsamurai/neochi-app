var exec : require('cordova/exec');

var Redis = {
initialize : function (host, port, success, error) {
    exec(success, error, 'Redis', 'initialize', [host, port]);
},

setStringValue : function (key, value, success, error) {
    exec(success, error, 'Redis', 'setStringValue', [key, value]);
},

setIntegerValue : function (key, value, success, error) {
    exec(success, error, 'Redis', 'setIntegerValue', [key, value]);
},

setJsonValue : function (key, value, success, error) {
    exec(success, error, 'Redis', 'setJsonValue', [key, value]);
},

getStringValue : function (key, success, error) {
    exec(success, error, 'Redis', 'getStringValue', [key]);
},

getIntegerValue : function (key, success, error) {
    exec(success, error, 'Redis', 'getIntegerValue', [key]);
},

getJsonValue : function (key, success, error) {
    exec(success, error, 'Redis', 'getJsonValue', [key]);
},

publish : function (channel, message, success, error) {
    exec(success, error, 'Redis', 'publish', [channel, message]);
},

subscribe : function (channels, success, error) {
    exec(success, error, 'Redis', 'subscribe', [channels]);
},

finalize : function (success, error) {
    exec(success, error, 'Redis', 'finalize', []);
}
};

module.exports=Redis;

