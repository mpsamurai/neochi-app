import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { RedisProvider } from '../../providers/redis/redis';
import { IrSignalPageNavParams, NAV_PARAMS_PARAM_NAME } from '../../interfaces/neochi';
import { IrSignal } from '../../interfaces/ir-signal';
import { NeochiProvider } from '../../providers/neochi/neochi';

/**
 * Generated class for the IrSignalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

enum IrReceivingState {
  Booting,
  Ready,
  Receiving,
  Saving,
  Error
}

enum IrSendingState {
  Booting,
  Ready,
  Sending,
  Error
}

@IonicPage()
@Component({
  selector: 'page-ir-signal',
  templateUrl: 'ir-signal.html',
})
export class IrSignalPage {

  irSignal: IrSignal;
  irReceivingState: IrReceivingState;
  irSendingState: IrSendingState;

  irReceivingMessage: string;

  nameInputValue: string;
  sleepInputValue: string;

  areContentsChanged: boolean;
  isIrSignalRecorded: boolean;

  checksContentsChange: boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,    
    private redisProvider: RedisProvider,
    private neochiProvider: NeochiProvider,
    private alertController: AlertController) {
  }

  ionViewDidLoad() {
    this.irReceivingState = IrReceivingState.Booting;
    this.irSendingState = IrSendingState.Booting;

    this.irReceivingMessage = '';

    this.nameInputValue = '';
    this.sleepInputValue = '';

    this.areContentsChanged = false;
    this.isIrSignalRecorded = false;

    this.checksContentsChange = true;

    let params: IrSignalPageNavParams = this.navParams.get(NAV_PARAMS_PARAM_NAME);
    if (params) {
      this.irSignal = params.irSignal;
      this.nameInputValue = this.irSignal.name;
      this.sleepInputValue = String(this.irSignal.sleep);
    }    

  }

  ionViewWillEnter() {
    console.log("IrSignalPage.ionViewWillEnter()");    
    this.redisProvider.initialize(this.neochiProvider.getNeochiIpAddress()).then(() => {
      this.checkIrSenderReceiverState();
      this.redisSubscribe();
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    console.log("IrSignalPage.ionViewWillLeave()");    
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  ionViewCanLeave(): boolean{
    // 画面を抜けるときに見て変更があれば保存するか問う
    if (this.checksContentsChange && this.areContentsChanged){
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

  checkIrSenderReceiverState() {
    this.redisProvider.getStringValue('ir-sender:state').then(value => {
      console.log('ir-sender:state value', value);
      if (value === 'ready') {
        this.irSendingState = IrSendingState.Ready;
      } else {
        this.irSendingState = IrSendingState.Error;
      }  
    }).catch(reason => {
      console.log("this.redisProvider.getStringValue('ir-sender:state').catch(): ", reason);
      this.irSendingState = IrSendingState.Error;
    });

    this.redisProvider.getStringValue('ir-receiver:state').then(value => {
      console.log('ir-receiver:state value', value);
      if (value === 'ready') {
        this.irReceivingState = IrReceivingState.Ready;
      } else if (value === 'receiving') {
        const message = { title: "stop_ir_receiving" };
        this.redisProvider.publish('neochi-app:ir-receiver', JSON.stringify(message)).then(() => {
          console.log('stop_ir_receiving publish success');
        }).catch((reason)=>{
          console.log('stop_ir_receiving publish error:', reason);
          this.presentErrorToast('停止に失敗しました');
        });
        this.irReceivingState = IrReceivingState.Ready;
      } else {
        this.irReceivingState = IrReceivingState.Error;
      }
    }).catch(reason => {
      console.log("this.redisProvider.getStringValue('ir-receiver:state').catch(): ", reason);
      this.irReceivingState = IrReceivingState.Error;
    });
  }

  redisSubscribe() {
    this.redisProvider.subscribe('ir-receiver:neochi-app', (message: string) => {
      console.log("this.redisProvider.subscribe() message:", message);
      let json: object;
      try {
        json = JSON.parse(message);        
      } catch (error) {
        console.log("error:", error);
        return;
      }
      const title = json['title'];
      console.log("title:", title);
      if (title === 'started_ir_receiving') {
        this.irReceivingState = IrReceivingState.Receiving;
        this.irReceivingMessage = '記録したいリモコンのボタンをneochiに向けて押してください';  
      } else if (title === 'stopped_ir_receiving_no_signal') {
        this.irReceivingState = IrReceivingState.Ready;
        this.irReceivingMessage = 'タイムアウトで記録を中止しました';  
      } else if (title === 'stopped_ir_receiving_invalid_signal') {
        this.irReceivingState = IrReceivingState.Ready;
        this.irReceivingMessage = '不正な信号で記録を中止しました';
      } else if (title === 'stopped_ir_receiving_valid_signal') {
        this.irReceivingState = IrReceivingState.Ready;
        this.irReceivingMessage = '記録が完了しました';
        this.areContentsChanged = true;
        this.isIrSignalRecorded = true;  
      } else if (title === 'stopped_ir_receiving_stop_message') {
        this.irReceivingState = IrReceivingState.Ready;
        this.irReceivingMessage = '記録を中止しました';
      } else if (title === 'stopped_ir_receiving_more_signal') {
      } else if (title === 'saved_ir_signal') {
        // 保存完了のメッセージを受けて前の画面に戻る
        // (戻らない場合はthis.irSignalの内容更新が必要)
        this.areContentsChanged = true;
        this.navCtrl.pop();
      } else if (title === 'ir_signal_saving_error') {
        this.presentErrorToast('保存に失敗しました');
      } else if (title === 'discarded_ir_signal') {
      } else if (title === 'ir_signal_discarding_error') {
      } else if (title === 'deleted_ir_signal') {
        this.navCtrl.pop();
      } else if (title === 'ir_signal_deleting_error') {
        this.presentErrorToast('削除に失敗しました');
      }
    }, (error) => {
      console.log("this.redisProvider.subscribe() error:", error);
    });
  }

  getIrReceivingMessage(): string {
    if (this.irReceivingState === IrReceivingState.Error) {
      return 'リモコン信号の受信ができない状態です';
    } else {
      return this.irReceivingMessage;
    }
  }

  getIrSendingMessage(): string {
    if (this.irSendingState === IrSendingState.Ready) {
      return '';
    } else if (this.irSendingState === IrSendingState.Error) {
      return 'リモコン信号の送信ができない状態です';
    } else {
      return '';
    }
  }  

  onInputName() {
    this.areContentsChanged = true;
  }

  onInputSleep() {
    this.areContentsChanged = true;
  }

  isDeleteButtonDisabled() {
    return false;
  }

  onClickDelete() {
    const alert = this.alertController.create({
      title: '削除しますか?',
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
            this.deleteIrSigna();
          }
        }
      ]
    });
    alert.present();
  }

  deleteIrSigna() {
    if (this.irSignal && this.irSignal.id) {
      const message = { title: "delete_ir_signal", id: this.irSignal.id };
      this.redisProvider.publish('neochi-app:ir-receiver', JSON.stringify(message)).then(() => {
      }).catch((reason)=>{
        this.presentErrorToast('削除に失敗しました');
      })
    } else {
      this.navCtrl.pop();
    }
  }

  isSaveButtonDisabled() {
    if (this.areContentsChanged && this.irSignal) {
      return false;
    } else {
      return true;
    }
  }

  onClickSave() {
    const message = { 
      title: "save_ir_signal", 
      id: this.irSignal.id,
      name: this.nameInputValue,
      sleep: Number(this.sleepInputValue),
      updatesFile: this.isIrSignalRecorded,
    };
    this.redisProvider.publish('neochi-app:ir-receiver', JSON.stringify(message)).then(() => {
    }).catch((reason)=>{
      this.presentErrorToast('保存に失敗しました');
    })
  }

  isReceiveButtonDisabled(): boolean {
    if (this.irReceivingState === IrReceivingState.Ready || this.irReceivingState === IrReceivingState.Receiving) {
      return false;
    } else {
      return true;
    }
  }

  onClickReceive() {
    if (this.irReceivingState === IrReceivingState.Ready) {
      console.log('start_ir_receiving');
      const message = { title: "start_ir_receiving" };
      this.redisProvider.publish('neochi-app:ir-receiver', JSON.stringify(message)).then(() => {
        console.log('start_ir_receiving publish success');
      }).catch((reason)=>{
        console.log('start_ir_receiving publish error:', reason);
      });
    } else if (this.irReceivingState === IrReceivingState.Receiving) {
      console.log('stop_ir_receiving');
      const message = { title: "stop_ir_receiving" };
      this.redisProvider.publish('neochi-app:ir-receiver', JSON.stringify(message)).then(() => {
        console.log('stop_ir_receiving publish success');
      }).catch((reason)=>{
        console.log('stop_ir_receiving publish error:', reason);
      });
    }
  }

  isSendButtonDisabled(): boolean {
    if (this.irSendingState === IrSendingState.Ready && this.irSignal && this.irSignal.filePath) {
      return false;
    } else {
      return true;
    }
  }

  onClickSend() {
    this.redisProvider.publish('start_ir_sending', String(this.irSignal.id)).then(() => {
    }).catch((reason)=>{
    })
  }

  getReceiveButtonLabel(): string {
    if (this.irReceivingState === IrReceivingState.Receiving) {
      return '記録中止';
    } else {
      return '記録開始';
    }
  }

  getIrSignalStateLabel(): string {
    if (!this.irSignal || !this.irSignal.fileTimeStamp) {
      return '未記録';
    } else {
      return '記録済(' + this.irSignal.fileTimeStamp + ')';
    }
  }

  presentErrorToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

}
