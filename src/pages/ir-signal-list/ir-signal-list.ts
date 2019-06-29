import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { RedisProvider } from '../../providers/redis/redis';
import { IrSignalPageNavParams, NAV_PARAMS_PARAM_NAME } from '../../interfaces/neochi';
import { IrSignal } from '../../interfaces/ir-signal';
import { NeochiProvider } from '../../providers/neochi/neochi';

/**
 * Generated class for the IrSignalListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

enum PageState {
  Booting,
  Ready,
  Error
}

@IonicPage()
@Component({
  selector: 'page-ir-signal-list',
  templateUrl: 'ir-signal-list.html',
})
export class IrSignalListPage {
  pageStateEnum: typeof PageState = PageState;

  pageState: PageState;
  irSignals: IrSignal[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public app: App,
    private redisProvider: RedisProvider,
    private neochiProvider: NeochiProvider) {
  }

  ionViewDidLoad() {
    this.pageState = PageState.Booting;
    this.irSignals = [];
  }

  ionViewWillEnter() {
    console.log("IrSignalListPage.ionViewWillEnter()");        
    this.redisProvider.initialize(this.neochiProvider.getNeochiIpAddress()).then(() => {
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
      this.pageState = PageState.Error;
      this.irSignals = [];
      return;
    }
    if (!json || !json.hasOwnProperty('signals')) {
      this.pageState = PageState.Error;
      this.irSignals = [];
      return;
    }
    this.irSignals = [];
    const signals = json['signals'];
    signals.forEach(s => {
      let irSignal = {
        id: s.id,
        name: s.name,
        sleep: s.sleep,
        filePath: s.filePath,
        fileTimeStamp: s.fileTimeStamp,
      };
      this.irSignals.push(irSignal);
    });
    this.pageState = PageState.Ready;
  }

  onClickDetail(irSignal: IrSignal) {
    let params: IrSignalPageNavParams = {
      irSignal: irSignal,
    };    
    this.navCtrl.push('IrSignalPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }

  isAddButtonDisabled() {
    if (this.pageState === PageState.Ready) {
      return false;
    } else {
      return true;
    }
  }

  onClickAdd() {
    let irSignal = {
      id: null,
      name: '',
      sleep: 0,
      filePath: null,
      fileTimeStamp: null,
    };

    let params: IrSignalPageNavParams = {
      irSignal: irSignal,
    };
    this.navCtrl.push('IrSignalPage', {[NAV_PARAMS_PARAM_NAME]: params});
  }

}
