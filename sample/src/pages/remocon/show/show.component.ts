import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Remocon } from '../../../models/remocon.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-remocon-show',
  templateUrl: './show.component.html'
})
export class ShowPageComponent {

  remocon: Remocon;

　// ページのクラスのメンバ変数として追加

  /** フォーム項目 */
  form: FormGroup;
  /** フォーム項目のエラーテキスト */
  errors = {};
  /** フォーム項目名 */
  controlNames = {
    name: "氏名",
    interval: "待ち時間",
    save: "情報を記憶する"
  };
  constructor(
    public navCtrl: NavController,
    navParams: NavParams,
    public formBuilder: FormBuilder
    ) {
      this.remocon = navParams.get('remocon');
      this.form = this.formBuilder.group({
        // 項目名: [初期値, ルール]
        name: [this.remocon.name, Validators.required],
        interval: ["", [ Validators.required ]],
        save: [false],
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RemoconPage');
 //
     var jsondata = {
      signals: [
        {
          id: 0,
          name: "寝室ライトON",
          sleep: 500,
          filePath: "/home/neochi/0.ir",
          fileTimeStamp: "20190501:200000.000"
        },
        {
          id: 1,
          name: "寝室ライトOFF",
          sleep: 500,
          filePath: "/home/neochi/1.ir",
          fileTimeStamp: "20190501:200000.000"
        }
      ]
    };
  }

  onRecodingStart() { alert("TODO; 近日公開予定");}

  submit() {
   // グループ内のどれかがエラーの場合
   if (!this.form.valid) {
     for (const field of Object.keys(this.form.controls)) {
       this.errors[field] = '';
       const control = this.form.get(field);
       // 項目ごとに入力エラーがあればエラーメッセージをセット
       if (!control.valid) {
         // 必須チェックがエラーの場合
         if (control.errors.required) {
           this.errors[field] = this.controlNames[field] + "を入力してください。";
         }
         // TODO その他
       }
     }
     return;
   }
  }
}

