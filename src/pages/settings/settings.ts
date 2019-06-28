import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
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
  areContentsChanged: boolean;
  
  constructor(
    public navCtrl: NavController,
    private neochiProvider: NeochiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.areContentsChanged = false;
  }

  ionViewWillEnter() {
    this.ipAddressInputValue = this.neochiProvider.getNeochiIpAddress();
  }

  isSaveButtonDisabled() {
    return !this.areContentsChanged;
  }

  onInputIpAddress() {
    this.areContentsChanged = true;    
  }

  onClickSave() {
    if (!this.ipAddressInputValue || this.ipAddressInputValue.length === 0) {
      this.ipAddressInputValue = this.neochiProvider.getDefaultNeochiIpAddress();
    }
    this.neochiProvider.setNeochiIpAddress(this.ipAddressInputValue);
    this.areContentsChanged = false;
  }

}
