# How to run

1. nvm, node.js のインストール

```
(node.js v8.12.0 をインストールする nvmの利用を推奨)
$ nvm install v8.12.0
```

2. 以下の手順でアプリとpluginをリポジトリから取得する
```
$ mkdir xxxx
$ git clone https://github.com/mpsamurai/neochi-app.git
$ git clone https://github.com/mpsamurai/cordova-plugin-redis

$ cd ../neochi-app
```


3. 以下の手順でアプリを起動する

```
$ npm install
(web版で表示のみ確認する）

$ npx ionic serve
 (ctrl +c)

(Android端末用のビルド）
$ npx ionic cordova build android 

(Android端末での実機確認)
$ npx ionic cordova run android --device

(iOS端末用のビルド）
$ npx ionic cordova build ios

(iOS端末での実機確認)
neochi-app/platforms/ios/Neochi.xcworkspace
をXCodeで開いて実行する
```
