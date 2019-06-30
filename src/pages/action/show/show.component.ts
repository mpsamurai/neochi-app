import { Component } from '@angular/core';
import { NavController, NavParams, AlertController  } from 'ionic-angular';
import { ActionSetPageNavParams, NAV_PARAMS_PARAM_NAME } from '../../../interfaces/neochi';
import { RedisProvider } from '../../../providers/redis/redis';
import { ActionSet } from '../../../interfaces/action-set';
import { IrSignal } from '../../../interfaces/ir-signal';
import { Action } from '../../../interfaces/action';
import { NeochiProvider } from '../../../providers/neochi/neochi';

enum PageState {
  Booting,
  Ready,
  Error
}

@Component({
  selector: 'page-article-show',
  templateUrl: './show.component.html'
})
export class ShowPageComponent {
  pageStateEnum: typeof PageState = PageState;

  actionSetId: number;
  pageState: PageState;
  actionSets: ActionSet[];
  actionSet: ActionSet;
  irSignals: IrSignal[];

  isActionSetChanged: boolean;

  checksContentsChange: boolean;

  constructor(
    public navCtrl: NavController,
    private alertController: AlertController,
    private navParams: NavParams,
    private redisProvider: RedisProvider,
    private neochiProvider: NeochiProvider,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    let params: ActionSetPageNavParams = this.navParams.get(NAV_PARAMS_PARAM_NAME);
    if (params) {
      this.actionSetId = params.id;
    }
    this.isActionSetChanged = false;
    this.checksContentsChange = true;
  }

  ionViewWillEnter() {
    console.log("IrSignalListPage.ionViewWillEnter()");
    this.redisProvider.initialize(this.neochiProvider.getNeochiIpAddress()).then(async () => {
      const b1 = await this.updateActionSet();
      const b2 = await this.updateIrSignals();
      if (b1 && b2) {
        this.pageState = PageState.Ready;
      } else {
        this.pageState = PageState.Error;
      }
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    console.log("IrSignalListPage.ionViewWillLeave()");        
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  ionViewCanLeave(): boolean{
    // 画面を抜けるときに見て変更があれば保存するか問う
    if (this.checksContentsChange && this.isActionSetChanged){
      const alert = this.alertController.create({
        title: '変更を保存せずに戻りますか?',
        buttons: [
          {
            text: 'キャンセル',
            role: 'cancel',
            handler: data => {
            }
          },
          {
            text: 'OK',
            handler: data => {
              this.checksContentsChange = false;
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
      return false;
    } else {
      return true;
    }
  }  

  async updateActionSet(): Promise<boolean> {
    let json: object;
    try {
      json = await this.redisProvider.getJsonValue('neochi-app:action');
    } catch (error) {
      console.log("updateActionSet() error:", error);
      return false;
    }

    this.actionSets = json['actionSets'];
    this.actionSet = this.actionSets[this.actionSetId];

    return true;
  }

  async updateIrSignals(): Promise<boolean> {
    this.irSignals = [];
    let json: object;
    try {
      json = await this.redisProvider.getJsonValue('ir-receiver:ir');
    } catch (error) {
      console.log("error:", error);
      return false;
    }
    if (!json || !json.hasOwnProperty('signals')) {
      return false;
    }
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
    return true;
  }

  onClickRemove(index: number) {
    this.actionSet.actions.splice(index, 1); 
    this.isActionSetChanged = true;
  }
  
  onClickAdd() {
    let checkOptions = [];
    this.irSignals.forEach((irSignal, index) => {
      checkOptions.push({
        type: 'radio',
        label: irSignal.name,
        value: irSignal.id,
        checked: (index === 0),
      });
    });

    let alert = this.alertCtrl.create({
      title: 'アクション追加',
      inputs: checkOptions,
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('data:', data);
            const action: Action = {
              type: 'ir',
              parameters: {
                id: data,
              },
            }
            this.actionSet.actions.push(action);
            this.isActionSetChanged = true;
          }
        }
      ]
    });
    alert.present();
  };

  isSaveButtonDisabled(): boolean{
    return !this.isActionSetChanged;
  }
  
  onClickSave() {
    const json = {
      'actionSets': this.actionSets,
    };
    this.redisProvider.setJsonValue('neochi-app:action', json).then(() => {
      // サーバーからの保存完了のメッセージを受けて保存する
      this.isActionSetChanged = false;
      this.navCtrl.pop();
    }).catch((reason)=>{
      console.log('onClickSave() reason:', reason);
    })
  }

}
