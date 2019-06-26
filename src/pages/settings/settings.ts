import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  /** フォーム項目 */
  form: FormGroup;
  /** フォーム項目のエラーテキスト */
  errors = {};
  /** フォーム項目名 */
  controlNames = {
    ipaddr: "xx.xxx.xxx.xxx",
    port: "nnn"
  };
  
  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      // 項目名: [初期値, ルール]
      ipaddr: ["", Validators.required],
      port: ["", [ Validators.required ]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
}
