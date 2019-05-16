cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-ionic-keyboard.keyboard",
      "file": "plugins/cordova-plugin-ionic-keyboard/www/ios/keyboard.js",
      "pluginId": "cordova-plugin-ionic-keyboard",
      "clobbers": [
        "window.Keyboard"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.IonicWebView",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/util.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "Ionic.WebView"
      ]
    },
    {
      "id": "cordova-plugin-ionic-webview.ios-wkwebview-exec",
      "file": "plugins/cordova-plugin-ionic-webview/src/www/ios/ios-wkwebview-exec.js",
      "pluginId": "cordova-plugin-ionic-webview",
      "clobbers": [
        "cordova.exec"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova.plugins.Redis.Redis",
      "file": "plugins/cordova.plugins.Redis/www/cordova.plugins.Redis.js",
      "pluginId": "cordova.plugins.Redis",
      "clobbers": [
        "cordova.plugins.Redis"
      ]
    },
    {
      "id": "cordova.plugin.Redis.Redis",
      "file": "plugins/cordova.plugin.Redis/www/cordova.plugin.Redis.js",
      "pluginId": "cordova.plugin.Redis",
      "clobbers": [
        "Redis"
      ]
    },
    {
      "id": "cordova-plugin-Redis.Redis",
      "file": "plugins/cordova-plugin-Redis/www/cordova-plugin-Redis.js",
      "pluginId": "cordova-plugin-Redis",
      "clobbers": [
        "Redis"
      ]
    },
    {
      "id": "cordova-plugin-redis.Redis",
      "file": "plugins/cordova-plugin-redis/www/Redis.js",
      "pluginId": "cordova-plugin-redis",
      "clobbers": [
        "cordova.plugins.Redis"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-ionic-keyboard": "2.1.3",
    "cordova-plugin-ionic-webview": "4.0.1",
    "cordova-plugin-splashscreen": "5.0.2",
    "cordova-plugin-statusbar": "2.4.2",
    "cordova-plugin-whitelist": "1.3.3",
    "cordova.plugins.Redis": "0.1.0",
    "cordova.plugin.Redis": "0.1.0",
    "cordova-plugin-Redis": "0.1.0",
    "cordova-plugin-redis": "0.1.0"
  };
});