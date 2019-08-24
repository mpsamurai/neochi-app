import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { DataAdditionPageNavParams, NAV_PARAMS_PARAM_NAME, DataSet, UNIT_IMAGE_NUMBER, LABEL_NONE, LABEL_MOVE, LABEL_MOVE_LAYING, LABEL_NO_MOVE_LAYING } from '../../interfaces/neochi';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { ImageProvider } from '../../providers/image/image';
import { File } from '@ionic-native/file';
import { FileProvider } from '../../providers/file/file';
import { RedisProvider } from '../../providers/redis/redis';
import { NeochiProvider } from '../../providers/neochi/neochi';

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

  requestedImage: boolean;
  successiveNetworkErrorNum: number;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private redisProvider: RedisProvider,
    private neochiProvider: NeochiProvider,
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
    this.requestedImage = false;
    this.successiveNetworkErrorNum = 0;

  }

  ionViewWillEnter() {
    console.log("IrSignalPage.ionViewWillEnter()");    
    this.redisProvider.initialize(this.neochiProvider.getNeochiIpAddress()).then(() => {
      this.startCaptureTimer();
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    console.log("IrSignalPage.ionViewWillLeave()");    
    this.abortCapture();
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  startCaptureTimer() {
    if (!this.captureTimer) {
      this.captureTimer = TimerObservable.create(0, 500).subscribe(() => {
        this.onCaptureTimer();
      });
    }
  }

  canCapture(): boolean {
    return this.captureTimer ? true : false;
  }

  abortCapture() {
    // loadingを非表示
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
    this.stopCaptureTimer()
  }

  stopCaptureTimer() {
    if (this.captureTimer) {
      this.captureTimer.unsubscribe();
      this.captureTimer = null;
    }
  }

  onNetworkSuccess() {
    this.successiveNetworkErrorNum = 0;
  }

  onNetworkError() {
    this.successiveNetworkErrorNum++;
    if (this.successiveNetworkErrorNum >= 8) {
      this.abortCapture();
      this.presentNetworkErrorToast();
    }
  }

  presentNetworkErrorToast() {
    let toast = this.toastCtrl.create({
      message: 'neochiへの接続に失敗しました',
      duration: 3000,
    });
    toast.present();
  }

  async onCaptureTimer() {

    if (!this.requestedImage) {
      this.requestedImage = true;
      this.redisProvider.getJsonValue('eye:image').then(async value => {
        this.onNetworkSuccess();
        if (value) {
          // キャプチャー時刻を追加
          value['captureTimeStamp'] = this.dateToFileNamePart(new Date());
          await this.drawAndCaptureImage(value);
        }
        this.requestedImage = false;
      }).catch(reason => {
        this.onNetworkError();
        this.requestedImage = false;
      });  
    }
  }

  async drawAndCaptureImage(imageObject: Object) {
    var w = imageObject['width'];
    var h = imageObject['height'];
    var rgbData = this.imageProvider.Base64a.decode(imageObject['image']);    
    this.imageProvider.drawImageFromRGBdata(rgbData, w, h, 'data-addition-canvas');

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


  onClickNone() {
    this.startCapture(LABEL_NONE);
  }

  onClickMove() {
    this.startCapture(LABEL_MOVE);
  }

  onClickMoveLaying() {
    this.startCapture(LABEL_MOVE_LAYING);
  }

  onClickNoMoveLaying() {
    this.startCapture(LABEL_NO_MOVE_LAYING);
  }


  private dateToFileNamePart(date: Date) {
    function pad(n: number) {
      if (n < 10) {
        return '0' + n;
      }
      return n;
    }

    return '' + date.getUTCFullYear() + 
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + '000'
  }

  /*
  private imageObjectTimeStampToIsoString(timeStamp: string): string {
    //return (new Date(timeStamp * 1000)).toISOString();
    let s = timeStamp;
    let iso = s.substring(0, 4) + '-' + s.substring(4, 6) + '-' + s.substring(6, 8) + 
      'T' + s.substring(8, 10) + ':' + s.substring(10, 12) + ':' + s.substring(12, 14) + '.' + s.substring(14, 20) + 'Z'
    console.log("iso:", iso);
    return iso;
  }
  
  private isoStringToFileNamePart(isoString: string) {
      return (isoString.split('-').join('').split('T').join('').split(':').join('').split('.').join('').split('Z').join(''));
  }
  */
  
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

    // '%Y%m%d%H%M%S%f' のディレクトリーがなければ作成
    //let dataDirName = this.isoStringToFileNamePart(this.imageObjectTimeStampToIsoString(imageObjects[0]['timeStamp']));
    let dataDirName = imageObjects[0]['captureTimeStamp'];
    let dataDirectoryEntry = await this.file.getDirectory(dataSetDirectoryEntry, dataDirName, { create: true });
    console.log("dataDirName:", dataDirName);
    console.log("dataDirectoryEntry:", dataDirectoryEntry);

    // image_<'%Y%m%d%H%M%S%f'>.json のファイルを作成
    for (let index = 0; index < imageObjects.length; index++) {
      const imageObject = imageObjects[index];
      const fileName = 'image_' + 
          //this.isoStringToFileNamePart(this.imageObjectTimeStampToIsoString(imageObjects[index]['timeStamp'])) + 
          imageObjects[index]['captureTimeStamp'] +
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
