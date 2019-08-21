import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataSetPageNavParams, NAV_PARAMS_PARAM_NAME, DataSet, DataAdditionPageNavParams, LABEL_AWAKE, LABEL_SLEEPING } from '../../interfaces/neochi';
import { NeochiProvider } from '../../providers/neochi/neochi';
import { FileProvider } from '../../providers/file/file';
import { File } from '@ionic-native/file/ngx';

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
    private  alertController: AlertController,
    private neochiProvider: NeochiProvider,
    private fileProvider: FileProvider,
    private file: File) {    
  }

  ionViewDidLoad() {
    console.log("DataSetPage ionViewDidEnter()");

    let params: DataSetPageNavParams = this.navParams.get(NAV_PARAMS_PARAM_NAME);
    if (params) {
      this.dataSet = params.dataSet;
    }
  }

  isDeleteButtonDisabled() {
    return false;
  }

  async ionViewDidEnter() {
    console.log("DataSetPage ionViewDidEnter()");

    this.dataList = [];

    try {
      const labelsObject = await this.loadLabelsObject(this.dataSet.id);
      console.log("labelsObject:", labelsObject);

      const labels = labelsObject['labels'];
  
      // TODO サムネイルの表示
  
      for (let index = 0; index < labels.length; index++) {
        const element = labels[index];
        const dataListItem = {
          timeStampString: element['directoryName'],
          labelString: element['label'],
        }
        this.dataList.push(dataListItem);
      }      
    } catch (error) {
      console.log("ionViewDidEnter() error:", error);
    }

  }

  async loadLabelsObject(dataSetId: number): Promise<Object> {
    console.log("loadLabelsObject()");

    console.log("this.file.dataDirectory:", this.file.dataDirectory);

    const dirEntry = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
    console.log("dirEntry:", dirEntry);

    let dataSetsDirectoryEntry = await this.file.getDirectory(dirEntry, FileProvider.DATA_SETS_DIRECTORY_NAME, { create: false });
    console.log("dataSetsDirectoryEntry:", dataSetsDirectoryEntry);

    let dataSetDirName = String(dataSetId);
    let dataSetDirectoryEntry = await this.file.getDirectory(dataSetsDirectoryEntry, dataSetDirName, { create: false });

    // labels.json を読み込み(なければ空のオブジェクトを作成)
    const labelsFileName = FileProvider.LABELS_FILE_NAME;
    let exists = false;
    try {
      await this.file.checkFile(dataSetDirectoryEntry.fullPath, labelsFileName);
      exists = true;
    } catch (error) {
      exists = false;
    }
    let labelsObject: Object;
    if (exists) {
      let labelsFileEntry = await this.file.getFile(dataSetDirectoryEntry, labelsFileName, { create: false });
      labelsObject = await this.fileProvider.readObjectFromFile(labelsFileEntry);  
    } else {
      labelsObject = { labels: [] };
    }
    return labelsObject;
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
            this.deleteDataSet(this.dataSet);
            this.navCtrl.pop();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteDataSet(dataSet: DataSet) {
    let dataSets = this.neochiProvider.getDataSets();
    let index: number = null;
    for (let i = 0; i < dataSets.length; i++) {
      const element = dataSets[i];
      if (element.id === dataSet.id) {
        index = i;
        break;
      }      
    }
    if (index === null) {
      // 削除するものが見当たらない
    } else {
      dataSets.splice(index, 1);
      this.neochiProvider.setDataSets(dataSets);

      // ファイル削除
      await this.deleteDataSetFiles(dataSet.id);
    }
  }

  async deleteDataSetFiles(dataSetId: number): Promise<void> {
    const dirEntry = await this.file.resolveDirectoryUrl(this.file.dataDirectory);

    let dataSetsDirectoryEntry = await this.file.getDirectory(dirEntry, FileProvider.DATA_SETS_DIRECTORY_NAME, { create: false });

    let dataSetDirName = String(dataSetId);
    let dataSetDirectoryEntry = await this.file.getDirectory(dataSetsDirectoryEntry, dataSetDirName, { create: false });

    return new Promise<void>((resolve, reject) => {
      dataSetDirectoryEntry.removeRecursively(() => {
        resolve();
      }, error => {
        reject(error);
      });  
    });
  }

  isRenameButtonDisabled() {
    return false;
  }
  
  async onClickRename() {
    const alert = await this.alertController.create({
      title: 'データセット名変更',
      //message: '新しいデータセット名を入力してください',
      inputs: [
        {
          name: 'name',
          placeholder: 'データセット名',
          value: this.dataSet.name
        },
      ],      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'OK',
          handler: data => {
            this.dataSet.name = data.name;
            this.saveDataSet(this.dataSet);
          }
        }
      ]
    });
    await alert.present();
  }

  saveDataSet(dataSet: DataSet) {
    let dataSets = this.neochiProvider.getDataSets();
    let index: number = null;
    for (let i = 0; i < dataSets.length; i++) {
      const element = dataSets[i];
      if (element.id === dataSet.id) {
        index = i;
        break;
      }      
    }
    if (index === null) {
      dataSets.push(dataSet);
    } else {
      dataSets[index] = dataSet;
    }
    this.neochiProvider.setDataSets(dataSets);
  }

  onClickTrain() {

  }

  onClickAddData() {
    console.log('onClickAddData()');

    let params: DataAdditionPageNavParams = {
      dataSet: this.dataSet,
    };
    this.navCtrl.push('DataAdditionPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }

  onClickRemoveData() {

  }

  onClickFilterData() {
    let alert = this.alertController.create();
    alert.setTitle('表示するデータ選択');

    alert.addInput({
      type: 'checkbox',
      label: '起きている',
      value: LABEL_AWAKE,
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: '寝ている',
      value: LABEL_SLEEPING
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log('Checkbox data:', data);
        // TODOフィルタリング
      }
    });
    alert.present();
  }

}
