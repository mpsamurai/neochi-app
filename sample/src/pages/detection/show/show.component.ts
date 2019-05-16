import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';
import { Dataset } from '../../../models/detection.model';

@Component({
  selector: 'page-detection-show',
  templateUrl: './show.component.html'
})
export class ShowPageComponent {

  dataset: Dataset;

  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.dataset = navParams.get('dataset');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetectionDetailPage');
  }
  openNavDetailsPage(){alert("TODO: 実装予定")}

  confirmStartML() {
    let alert = this.alertCtrl.create({
      title: '学習を開始しますか',
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
              //学習開始
            }
          }
      ]
    });
    alert.present();
  }

  showPreperence() {
    let checkOptions = [
      {type: 'checkbox', label: `起きている`, value: "awake", checked: true},
      {type: 'checkbox', label: `寝ている`, value: "sleeping", checked: true}
    ]

    let alert = this.alertCtrl.create({
      title: '表示設定',
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
  }
}
