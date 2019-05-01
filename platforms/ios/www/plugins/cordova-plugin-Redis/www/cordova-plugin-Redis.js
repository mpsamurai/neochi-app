cordova.define("cordova-plugin-Redis.Redis", function(require, exports, module) {
var exec = require('cordova/exec');


var Redis = {

    isBusy: true,

    overlaysWebView: function (doOverlay) {
        exec(null, null, "StatusBar", "overlaysWebView", [doOverlay]);
    },


    initialize:  function (ipaddr,key, success, error) {
    // exec(success, error, 'cordova.plugins.Redis', 'coolMethod', [arg0]);
    },
    setStringValue: function (ipaddr,key, success, error) {
    // exec(success, error, 'cordova.plugins.Redis', 'coolMethod', [arg0]);
    },
    getStringValue: function (ipaddr,key, success, error) {
    // exec(success, error, 'cordova.plugins.Redis', 'coolMethod', [arg0]);
    },
    finalize: function (succes, error) {
    // exec(success, error, 'cordova.plugins.Redis', 'coolMethod', [arg0]);
    }
};

module.exports = Redis;

});
