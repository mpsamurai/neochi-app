import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { RedisProvider } from '../../providers/redis/redis';
import { IrSignalPageNavParams, NAV_PARAMS_PARAM_NAME } from '../../interfaces/neochi';
import { IrSignal } from '../../interfaces/ir-signal';

/**
 * Generated class for the IrSignalListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ir-signal-list',
  templateUrl: 'ir-signal-list.html',
})
export class IrSignalListPage {

  irSignals: IrSignal[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public app: App,
    private redisProvider: RedisProvider) {
  }

  ionViewDidLoad() {
    this.irSignals = [];
  }

  ionViewWillEnter() {
    console.log("IrSignalListPage.ionViewWillEnter()");        
    this.redisProvider.initialize().then(() => {
      this.updateIrSignalList();
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    console.log("IrSignalListPage.ionViewWillLeave()");        
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  async updateIrSignalList() {
    let json: object;
    try {
      json = await this.redisProvider.getJsonValue('ir-receiver:ir');      
    } catch (error) {
      console.log("error:", error);
      this.irSignals = [];
      return;
    }
    if (!json || !json.hasOwnProperty('signals')) {
      this.irSignals = [];
      return;
    }
    this.irSignals = [];
    const signals = json['signals'];
    signals.forEach(s => {
      let irSignal = new IrSignal();
      irSignal.id = s.id;
      irSignal.name = s.name;
      irSignal.sleep = s.sleep;
      irSignal.filePath = s.filePath;
      irSignal.fileTimeStamp = s.fileTimeStamp;
      this.irSignals.push(irSignal);
    });
  }

  onClickDetail(irSignal: IrSignal) {
    let params: IrSignalPageNavParams = {
      irSignal: irSignal,
    };    
    this.navCtrl.push('IrSignalPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }

  onClickAdd() {
    let irSignal = new IrSignal();
    irSignal.id = null;
    irSignal.name = '';
    irSignal.sleep = 0;
    irSignal.filePath = null;
    irSignal.fileTimeStamp = null;

    let params: IrSignalPageNavParams = {
      irSignal: irSignal,
    };
    this.navCtrl.push('IrSignalPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }

}
