import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataSetPageNavParams, NAV_PARAMS_PARAM_NAME, DataSet, DataAdditionPageNavParams, LABEL_NONE, LABEL_NO_MOVE_LAYING, LABEL_MOVE_LAYING, LABEL_MOVE } from '../../interfaces/neochi';
import { NeochiProvider } from '../../providers/neochi/neochi';
import { FileProvider } from '../../providers/file/file';
import { File } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';

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
    private alertController: AlertController,
    private neochiProvider: NeochiProvider,
    private fileProvider: FileProvider,
    private file: File,
    private httpClient: HttpClient) {    
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
      if (!labelsObject) {
        return;
      }

      // TODO サムネイルの表示

      const labels = labelsObject['labels'];
 
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

  // labels.json からラベルをロードする
  // ファイルが無ければnullを返す
  async loadLabelsObject(dataSetId: number): Promise<Object> {
    console.log("loadLabelsObject()");

    console.log("this.file.dataDirectory:", this.file.dataDirectory);

    const dirEntry = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
    console.log("dirEntry:", dirEntry);

    try {
      console.log("dirEntry.nativeURL:", dirEntry.nativeURL);
      await this.file.checkDir(dirEntry.nativeURL, FileProvider.DATA_SETS_DIRECTORY_NAME);
      console.log("existing");
    } catch (error) {
      console.log("not existing");
      return null;
    }
    let dataSetsDirectoryEntry = await this.file.getDirectory(dirEntry, FileProvider.DATA_SETS_DIRECTORY_NAME, { create: false });
    console.log("dataSetsDirectoryEntry:", dataSetsDirectoryEntry);

    let dataSetDirName = String(dataSetId);
    try {
      console.log("dataSetsDirectoryEntry.nativeURL:", dataSetsDirectoryEntry.nativeURL);
      await this.file.checkDir(dataSetsDirectoryEntry.nativeURL, dataSetDirName);
      console.log("existing");
    } catch (error) {
      console.log("not existing");
      return null;
    }
    let dataSetDirectoryEntry = await this.file.getDirectory(dataSetsDirectoryEntry, dataSetDirName, { create: false });

    // labels.json を読み込み(なければ空のオブジェクトを作成)
    const labelsFileName = FileProvider.LABELS_FILE_NAME;
    try {
      console.log("dataSetDirectoryEntry.nativeURL:", dataSetDirectoryEntry.nativeURL);
      await this.file.checkFile(dataSetDirectoryEntry.nativeURL, labelsFileName);
      console.log("existing");
    } catch (error) {
      console.log("not existing");
      return null;
    }
    let labelsFileEntry = await this.file.getFile(dataSetDirectoryEntry, labelsFileName, { create: false });

    let s = await this.fileProvider.readStringFromFile(labelsFileEntry);      
    return JSON.parse(s);
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

  async onClickTrain() {
    // zipファイルの作成
    try {
      await this.createZipFile(this.dataSet.id);
      await this.uploadZipFile(this.dataSet.id);
    } catch (error) {
      console.log("error:", error);
    }
  }

  async createZipFile(dataSetId: number): Promise<void> {
    console.log("createZipFile()");

    const dataSetsDirectoryPath = this.fileProvider.joinNativeUrl(this.file.dataDirectory, 
      [FileProvider.DATA_SETS_DIRECTORY_NAME], true);

    const dataSetDirName = String(dataSetId);
    const dataSetDirectoryPath = this.fileProvider.joinNativeUrl(dataSetsDirectoryPath, 
      [dataSetDirName], true);

    await this.file.checkDir(dataSetsDirectoryPath, dataSetDirName);
      
    let zipFileName = dataSetDirName + '.zip';
    let zipFilePath = this.fileProvider.joinNativeUrl(dataSetsDirectoryPath, 
      [zipFileName], false);

    console.log("zipFilePath:", zipFilePath);

    const zeep = (<any>window).Zeep;
    return new Promise<void>((resolve, reject) => {
      zeep.zip({
        from: dataSetDirectoryPath,
        to: zipFilePath,
      }, () => {
        resolve();
      }, function(e) {
        reject(e);
      });      
    });
  }

  async uploadZipFile(dataSetId: number): Promise<void> {
    console.log("uploadZipFile()");

    const dataSetDirName = String(dataSetId);
    const zipFileName = dataSetDirName + '.zip';

    const dataSetsDirectoryPath = this.fileProvider.joinNativeUrl(this.file.dataDirectory, 
      [FileProvider.DATA_SETS_DIRECTORY_NAME], true);
    const dataSetsDirectoryEntry = await this.file.resolveDirectoryUrl(dataSetsDirectoryPath);

    await this.file.checkFile(dataSetsDirectoryPath, zipFileName);

    const zipFileEntry = await this.file.getFile(dataSetsDirectoryEntry, zipFileName, { create: false });

    // 確認用にコピー → エラーは起きないがファイラーからファイルが見つからない
    //const copiedZipFileEntry = await this.file.copyFile(dataSetsDirectoryEntry.nativeURL, zipFileName, this.file.externalDataDirectory, zipFileName);
    //console.log('copiedZipFileEntry:', copiedZipFileEntry);

    return new Promise<void>((resolve, reject) => {
      zipFileEntry.file(resFile => {
        var reader = new FileReader();
        reader.onloadend = (evt: any) => {
          console.log("evt.target.result:", evt.target.result);

          var zipBlob: any = new Blob([evt.target.result], { type: 'application/zip' });
          zipBlob.name = zipFileName;
          const endpoint = this.neochiProvider.getWebApiBaseUrl() + 'upload-file';
          const formData: FormData = new FormData();
          formData.append('file', zipBlob, zipBlob.name);
          this.httpClient.post(endpoint, formData).subscribe(data => {
            console.log("data:", data);
            resolve();
          }, error => {
            reject(error);
          });
        };
        reader.onerror = e => {
          console.log('Failed file read:', e);
          reject(e);
        };
        reader.readAsArrayBuffer(resFile);
      }, e => {
        reject(e);
      });
    });
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
      label: '人がいない',
      value: LABEL_NONE,
      checked: true
    });
    alert.addInput({
      type: 'checkbox',
      label: '立って動いている',
      value: LABEL_MOVE,
      checked: true
    });
    alert.addInput({
      type: 'checkbox',
      label: '横になって動いている',
      value: LABEL_MOVE_LAYING,
      checked: true
    });
    alert.addInput({
      type: 'checkbox',
      label: '寝ている',
      value: LABEL_NO_MOVE_LAYING,
      checked: true
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
