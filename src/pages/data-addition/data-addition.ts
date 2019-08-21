import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { DataAdditionPageNavParams, NAV_PARAMS_PARAM_NAME, DataSet, LABEL_AWAKE, LABEL_SLEEPING, UNIT_IMAGE_NUMBER } from '../../interfaces/neochi';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { ImageProvider } from '../../providers/image/image';
import { File } from '@ionic-native/file';
import { FileProvider } from '../../providers/file/file';

/**
 * Generated class for the DataAdditionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-data-addition',
  templateUrl: 'data-addition.html',
})
export class DataAdditionPage {
  
  dataSet: DataSet;
  isCapturing: boolean;
  capturingImageObjects: any[];
  capturingImageLabel: string;

  loading: Loading;
  
  captureTimer: Subscription;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private imageProvider: ImageProvider,
    private fileProvider: FileProvider,
    private file: File) {
    this.isCapturing = false;
  }

  ionViewDidLoad() {
    let params: DataAdditionPageNavParams = this.navParams.get(NAV_PARAMS_PARAM_NAME);
    if (params) {
      this.dataSet = params.dataSet;
    }
  }

  ionViewWillEnter() {
    console.log("IrSignalPage.ionViewWillEnter()");    
    this.startCaptureTimer();
  }

  ionViewWillLeave() {
    console.log("IrSignalPage.ionViewWillLeave()");    
    this.stopCaptureTimer();
  }

  startCaptureTimer() {
    if (!this.captureTimer) {
      this.captureTimer = TimerObservable.create(0, 500).subscribe(() => {
        this.onCaptureTimer();
      });
    }
  }

  stopCaptureTimer() {
    if (this.captureTimer) {
      this.captureTimer.unsubscribe();
      this.captureTimer = null;
    }
  }
  
  async onCaptureTimer() {
    // TODO 画像のRedisからの取得
    const imageObject = {
      width: 1,
      height: 1,
      channel: 3,
      image: this.imageProvider.Base64a.encode(new Uint8Array(3)),
      timeStamp: (new Date()).getTime() / 1000,
    };

    const value = imageObject;
    var w = value['width'];
    var h = value['height'];
    var rgbData = this.imageProvider.Base64a.decode(value['image']);    
    this.imageProvider.drawImageFromRGBdata(rgbData, w, h, 'canvas');

    // capturingImageObjects にimageObjectを追加
    if (this.isCapturing) {

      this.capturingImageObjects.push(imageObject);

      // UNIT_IMAGE_NUMBER に達したら
      if (this.capturingImageObjects.length >= UNIT_IMAGE_NUMBER) {
        this.isCapturing = false;

        // loadingを非表示
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
 
        try {
          await this.addImagesToDataSet(this.dataSet.id, this.capturingImageObjects, this.capturingImageLabel);
        } catch (error) {
          console.log("error:", error);
        }

      }
    }


  }

  startCapture(label: string) {
    this.isCapturing = true;
    this.capturingImageObjects = [];
    this.capturingImageLabel = label;

    // loadingを表示
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();  
    }
  }

  onClickAwake() {
    this.startCapture(LABEL_AWAKE);
  }

  onClickSleeping() {
    this.startCapture(LABEL_SLEEPING);
  }

  private imageObjectTimeStampToIsoString(timeStamp: number): string {
    return (new Date(timeStamp * 1000)).toISOString();
  }
  
  private isoStringToFileNamePart(isoString: string) {
      return (isoString.split('-').join('').split(':').join(''));
  }
  
  // データセットにイメージを追加する
  // 具体的には以下のパスにimageObjectsの数だけjsonファイルを追加する
  // <dataSetId>/<yyyymmddThhmmss.sss>/image_<yyyymmddThhmmss.sss>.json
  // <yyyymmddThhmmss.sss> は imageObjects のはじめの要素の timeStamp から作る
  // image_<yyyymmddThhmmss.sss>.json は imageObjects の各要素の timeStamp から作る
  private async addImagesToDataSet(dataSetId: number, imageObjects: Object[], label: string) {
    console.log("addImagesToDataSet()");

    if (imageObjects.length < 1 || imageObjects.length < UNIT_IMAGE_NUMBER) {
      return;
    }

    const dirEntry = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
    console.log("dirEntry:", dirEntry);

    // data-setsディレクトリーがなければ作成
    let dataSetsDirectoryEntry = await this.file.getDirectory(dirEntry, FileProvider.DATA_SETS_DIRECTORY_NAME, { create: true });
    console.log("dataSetsDirectoryEntry:", dataSetsDirectoryEntry);

    // <dataSetId> のディレクトリーがなければ作成
    let dataSetDirName = String(dataSetId);
    let dataSetDirectoryEntry = await this.file.getDirectory(dataSetsDirectoryEntry, dataSetDirName, { create: true });
    console.log("dataSetDirectoryEntry:", dataSetDirectoryEntry);

    // <yyyymmddThhmmss.sss> のディレクトリーがなければ作成
    let dataDirName = this.isoStringToFileNamePart(this.imageObjectTimeStampToIsoString(imageObjects[0]['timeStamp']));
    let dataDirectoryEntry = await this.file.getDirectory(dataSetDirectoryEntry, dataDirName, { create: true });
    console.log("dataDirName:", dataDirName);
    console.log("dataDirectoryEntry:", dataDirectoryEntry);

    // image_<yyyymmddThhmmss.sss>.json のファイルを作成
    for (let index = 0; index < imageObjects.length; index++) {
      const imageObject = imageObjects[index];
      const fileName = 'image_' + 
          this.isoStringToFileNamePart(this.imageObjectTimeStampToIsoString(imageObjects[index]['timeStamp'])) + 
          '.json';
      let fileEntry = await this.file.getFile(dataDirectoryEntry, fileName, { create: true });
      await this.fileProvider.writeObjectToFile(fileEntry, imageObject);
    }

    // labels.json を読み込み(なければ空のオブジェクトを作成)
    const labelsFileName = FileProvider.LABELS_FILE_NAME;
    let exists = false;
    try {
      await this.file.checkFile(dataSetDirectoryEntry.nativeURL, labelsFileName);
      exists = true;
      console.log("existing");
    } catch (error) {
      exists = false;
      console.log("not existing");
    }
    let labelsObject: Object;
    if (exists) {
      let labelsFileEntry = await this.file.getFile(dataSetDirectoryEntry, labelsFileName, { create: false });
      let s = await this.fileProvider.readStringFromFile(labelsFileEntry);  
      labelsObject = JSON.parse(s);
    } else {
      labelsObject = { labels: [] };
    }
    console.log("labelsObject:", labelsObject);

    // labelsの存在を確認し、なければ追加
    if (!labelsObject.hasOwnProperty('labels')) {
      labelsObject['labels'] = [];
    }

    // labelsにラベルを追加
    labelsObject['labels'].push({
      directoryName: dataDirName,
      label: label,
    });

    console.log("labelsObject:", labelsObject);

    // labels.json に書き戻し
    let labelsFileEntry = await this.file.getFile(dataSetDirectoryEntry, labelsFileName, { create: true });
    await this.fileProvider.writeObjectToFile(labelsFileEntry, labelsObject);

    // TODO サムネイルの保存
  }




}
