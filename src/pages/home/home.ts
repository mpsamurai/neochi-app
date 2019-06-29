import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { RedisProvider } from '../../providers/redis/redis';
import { ImageProvider } from '../../providers/image/image';
import { NeochiProvider } from '../../providers/neochi/neochi';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export default class HomePage {

  static readonly P_ARRAY_LENGTH = 10;

  timer: Subscription;
  streamUrl: string;

  pOnBedArray: number[] = [];
  pSleepArray: number[] = [];

  requestedImage: boolean;
  requestedPOnBed: boolean;
  requestedPSleep: boolean;

  successiveNetworkErrorNum: number;

  // https://www.djamware.com/post/598953f880aca768e4d2b12b/creating-beautiful-charts-easily-using-ionic-3-and-angular-4

  lineChartLabels = [0, 1, 2, 3, 4, 5, 6, 7];
  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0, // disables bezier curves
      }
    },
    animation: {
      duration: 0, // general animation time
    },
    scales: {
      yAxes: [{
        ticks: {
          max: 1,
          min: 0,
          stepSize: 0.1
        }
      }],
    }
  };
  lineChartType = 'line';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private redisProvider: RedisProvider,
    private neochiProvider: NeochiProvider,
    private imageProvider: ImageProvider) {
    console.log('MonitoringPage constructor()');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.pOnBedArray = [];
    this.pSleepArray = [];
    for (var i = 0; i < HomePage.P_ARRAY_LENGTH; i++) {
      this.pOnBedArray.push(0);
      this.pSleepArray.push(0);
    }
    this.requestedImage = false;
    this.requestedPOnBed = false;
    this.requestedPSleep = false;
    this.successiveNetworkErrorNum = 0;
  }

  ionViewWillEnter() {
    console.log("IrSignalPage.ionViewWillEnter()");    
    this.redisProvider.initialize(this.neochiProvider.getNeochiIpAddress()).then(() => {
      this.startTimer();
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    console.log("IrSignalPage.ionViewWillLeave()");    
    this.stopTimer();
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  presentNetworkErrorToast() {
    let toast = this.toastCtrl.create({
      message: 'neochiへの接続に失敗しました',
      duration: 3000,
    });
    toast.present();
  }

  startTimer() {
    if (!this.timer) {
      this.timer = TimerObservable.create(0, 500).subscribe(() => {
        this.onTimer();
      });
    }
  }

  stopTimer() {
    if (this.timer) {
      this.timer.unsubscribe();
      this.timer = null;
    }
  }

  onNetworkSuccess() {
    this.successiveNetworkErrorNum = 0;
  }

  onNetworkError() {
    this.successiveNetworkErrorNum++;
    if (this.successiveNetworkErrorNum >= 8) {
      this.stopTimer();
      this.presentNetworkErrorToast();
    }
  }

  onTimer() {
    console.log(`interval: ${new Date()}`)

    if (!this.requestedImage) {
      this.requestedImage = true;
      this.redisProvider.getJsonValue('eye:image').then(value => {
        this.onNetworkSuccess();
        if (value) {
          var w = value['width'];
          var h = value['height'];
          var rgbData = this.imageProvider.Base64a.decode(value['image']);
          this.imageProvider.drawImageFromRGBdata(rgbData, w, h, 'canvas');  
        }
        this.requestedImage = false;
      }).catch(reason => {
        this.onNetworkError();
        this.requestedImage = false;
      });  
    }    

    if (!this.requestedPOnBed) {
      this.requestedPOnBed = true;
      this.redisProvider.getNumberValue('brain:on-bed').then(value => {
        this.onNetworkSuccess();
        this.pOnBedArray.unshift(value);
        this.pOnBedArray.pop();
        this.requestedPOnBed = false;
      }).catch(reason => {
        this.onNetworkError();
        this.requestedPOnBed = false;
      });  
    }    

    if (!this.requestedPOnBed) {
      this.requestedPOnBed = true;
      this.redisProvider.getNumberValue('brain:on-bed').then(value => {
        this.onNetworkSuccess();
        this.pOnBedArray.unshift(value);
        this.pOnBedArray.pop();
        this.requestedPOnBed = false;
      }).catch(reason => {
        this.onNetworkError();
        this.requestedPOnBed = false;
      });  
    }

    if (!this.requestedPSleep) {
      this.requestedPSleep = true;
      this.redisProvider.getNumberValue('brain:sleeping-possibility').then(value => {
        this.onNetworkSuccess();
        this.pSleepArray.unshift(value);
        this.pSleepArray.pop();
        this.requestedPSleep = false;
      }).catch(reason => {
        this.onNetworkError();
        this.requestedPSleep = false;
      });
    }
  }

  getPOnBedDatasets() {
    return [{data: this.pOnBedArray, label: 'On Bed'}];
  }

  getPSleepDatasets() {
    return [{data: this.pSleepArray, label: 'Sleep'}];
  }

  onClickSettings() {
    this.navCtrl.push('SettingsPage');
  }


}
