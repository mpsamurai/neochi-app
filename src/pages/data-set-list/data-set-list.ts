import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataSet, NAV_PARAMS_PARAM_NAME, DataSetPageNavParams } from '../../interfaces/neochi';
import { NeochiProvider } from '../../providers/neochi/neochi';

/**
 * Generated class for the DataSetListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-set-list',
  templateUrl: 'data-set-list.html',
})
export class DataSetListPage {

  dataSets: DataSet[];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private neochiProvider: NeochiProvider) {
    this.dataSets = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataSetListPage');
  }

  ionViewDidEnter() {
    this.dataSets = this.neochiProvider.getDataSets();
  }

  onClickDetail(dataSet: DataSet) {
    let params: DataSetPageNavParams = {
      dataSet: dataSet,
    };    
    this.navCtrl.push('DataSetPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }

  isAddButtonDisabled() {
    return false;
  }

  onClickAdd() {
    let maxId = -1;
    for (let index = 0; index < this.dataSets.length; index++) {
      const dataSet = this.dataSets[index];
      if (maxId < dataSet.id) {
        maxId = dataSet.id;
      }      
    }
    let dataSet = {
      id: maxId + 1,
      name: '新規データセット',
    };
    this.dataSets.push(dataSet);
    this.neochiProvider.setDataSets(this.dataSets);
    let params: DataSetPageNavParams = {
      dataSet: dataSet,
    };
    this.navCtrl.push('DataSetPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }


}
