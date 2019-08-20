import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataSetPageNavParams, NAV_PARAMS_PARAM_NAME, DataSet } from '../../interfaces/neochi';

/**
 * Generated class for the DataSetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


interface DataListItem {
  timeStampString: string,
  labelString: string,
}

@IonicPage()
@Component({
  selector: 'page-data-set',
  templateUrl: 'data-set.html',
})
export class DataSetPage {
  dataSet: DataSet;
  dataList: DataListItem[];

  // TODO 学習実施日時と最終更新日時から学習済みか否かを判断して表示する

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private  alertController: AlertController) {
  }

  ionViewDidLoad() {
    let params: DataSetPageNavParams = this.navParams.get(NAV_PARAMS_PARAM_NAME);
    if (params) {
      this.dataSet = params.dataSet;
    }
  }

  isDeleteButtonDisabled() {
    return false;
  }

  async onClickDelete() {
    const alert = await this.alertController.create({
      title: '確認',
      message: 'このデータセットを削除しますか？',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'OK',
          handler: () => {
            this.deleteDataSet();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteDataSet() {
  }

  isRenameButtonDisabled() {
    return false;
  }
  
  onClickRename() {

  }


}
