import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';
import { Action } from '../../../models/action.model';

declare const cordova: any;
// declare const Redis: any;
// var Redis = cordova.plugins.Redis

@Component({
  selector: 'page-article-show',
  templateUrl: './show.component.html'
})
export class ShowPageComponent {

  action: Action;
  actionFlow: String[] = ['部屋の照明 ON', 'エアコン ON']
  actionMap: { [key: number]: string; } = {};

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private alertCtrl: AlertController
    ) {
      this.action = navParams.get('action');
      this.actionMap[1] = '部屋の照明 ON';
      this.actionMap[2] = '部屋の照明 FF';
      this.actionMap[3] = 'エアコン ON';

    console.log('ionViewDidLoad NewsPage');

    // window.alert(cordova.plugins.Redis.initialize);


  }
  ionViewDidLoad() {
    //
    var jsondata = {
      actionSets: [
        {
          id: 0,
          name: "寝落ち検出時",
          actions: [
            {
              type: "ir",
              parameters: {
                id: 0
              }
            },
            {
              type: "ir",
              parameters: {
                id: 1
              }
            },
          ]
        }
      ]
    };


    this.putAction("neochi-app:action", jsondata);
  }
  onActionRemove(action: string) {alert("TODO: 実装予定")}
  onActionAdd() {
    let checkOptions = [
      {type: 'radio', label: '部屋の照明 ON', value: "1", checked: false},
      {type: 'radio', label: this.actionMap[2], value: "2", checked: false},
      {type: 'radio', label: this.actionMap[3], value: "3", checked: false}
    ]
    let alert = this.alertCtrl.create({
      title: 'アクション追加',
      inputs: checkOptions,
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
              //設定保存
          }
        }
      ]
    });
    alert.present();
  };
  putAction(key: String, value: Object) {
    // window.alert(cordova.plugins.Redis.initialize);
    try {
      // TODO: TODO: rx.jsで直す
      cordova.plugins.Redis.initialize('172.31.16.33','6379',
        function(m) {window.alert("Redis init success:"+m);
        cordova.plugins.Redis.setJsonValue(key, value,
            function(m) {
              // window.alert("set data");
                cordova.plugins.Redis.getJsonValue(key,
                  function(m) {
                    // debug print
                    window.alert(JSON.stringify(m));
                    cordova.plugins.Redis.finalize(
                      function(m) {window.alert("Redis fin success:"+m);},
                      function(e) {window.alert("Redis fin error:"+e);}
                    );
                  },
                  function(e) {window.alert("Redis get error:"+e);
                    cordova.plugins.Redis.finalize(
                      function(m) {window.alert("Redis fin success:"+m);},
                      function(e) {window.alert("Redis fin error:"+e);}
                    );
                    }
                );
              },
              function(e) {
                window.alert(e);
                cordova.plugins.Redis.finalize(
                  function(m) {window.alert("Redis fin success:"+m);},
                  function(e) {window.alert("Redis fin error:"+e);}
                );
              }
        )},
        function(e) {window.alert("Redis init error:"+e);
        }
      );

    } catch (e) {
      window.alert(e);
    }
  }

}
