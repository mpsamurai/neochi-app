import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { NeochiProvider } from '../../providers/neochi/neochi';

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

  ipAddressInputValue: string;
  webApiBaseUrlInputValue: string;
  areContentsChanged: boolean;

  checksContentsChange: boolean;
  
  constructor(
    public navCtrl: NavController,
    private alertController: AlertController,
    private neochiProvider: NeochiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.areContentsChanged = false;
    this.checksContentsChange = true;
  }

  ionViewWillEnter() {
    this.ipAddressInputValue = this.neochiProvider.getNeochiIpAddress();
    this.webApiBaseUrlInputValue = this.neochiProvider.getWebApiBaseUrl();
  }

  ionViewCanLeave(): boolean{
    // 画面を抜けるときに見て変更があれば保存するか問う
    if (this.checksContentsChange && this.areContentsChanged){
      const alert = this.alertController.create({
        title: '変更を保存せずに戻りますか?',
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
              this.checksContentsChange = false;
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
      return false;
    } else {
      return true;
    }
  }

  isSaveButtonDisabled() {
    return !this.areContentsChanged;
  }

  onInputIpAddress() {
    this.areContentsChanged = true;    
  }

  onInputWebApiBaseUrl() {
    this.areContentsChanged = true;
  }

  onClickSave() {
    if (!this.ipAddressInputValue || this.ipAddressInputValue.length === 0) {
      this.ipAddressInputValue = this.neochiProvider.getDefaultNeochiIpAddress();
    }
    this.neochiProvider.setNeochiIpAddress(this.ipAddressInputValue);

    if (!this.webApiBaseUrlInputValue || this.webApiBaseUrlInputValue.length === 0) {
      this.webApiBaseUrlInputValue = this.neochiProvider.getDefaultWebApiBaseUrl();
    }
    this.neochiProvider.setWebApiBaseUrl(this.webApiBaseUrlInputValue);
    
    this.areContentsChanged = false;
    this.navCtrl.pop();
  }

}
