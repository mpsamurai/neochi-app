# How to run

1. 以下の手順でアプリとpluginをリポジトリから取得する
```
$ mkdir xxxx
$ git clone https://github.com/mpsamurai/neochi-app.git
$ git clone https://github.com/mpsamurai/cordova-plugin-redis

$ cd ../neochi-app
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
