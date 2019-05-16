# How to run

1. 以下の手順でアプリとpluginをリポジトリから取得する
```
$ mkdir xxxx
$ git clone https://github.com/ythink/neochi-app.git

$ mkdir plugin
$ cd plugin
$ git clone https://github.com/evianyuji/cordova-plugin-redis.git

$ cd ../neochi-app
$ ionic cordova plugin add ../plugin/cordova-plugin-redis-master 
```


2. 以下の手順でアプリを起動する

```
$ npm install
(web版で表示のみ確認する）

$ ionic serve
 (ctrl +c)

(モバイル用のリソース追加）
$ ionic cordova platform add android 
$ ionic cordova platform add ios 

(Androidの実機確認）
$ ionic cordova run android 

```
