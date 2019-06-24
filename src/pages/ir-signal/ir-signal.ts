import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedisProvider } from '../../providers/redis/redis';
import { IrSignalPageNavParams, NAV_PARAMS_PARAM_NAME } from '../../interfaces/neochi';
import { IrSignal } from '../../interfaces/ir-signal';

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private redisProvider: RedisProvider) {
  }

  ionViewDidLoad() {
    this.irReceivingState = IrReceivingState.Booting;
    this.irSendingState = IrSendingState.Booting;

    this.irReceivingMessage = '';

    this.nameInputValue = '';
    this.sleepInputValue = '';

    this.areContentsChanged = false;
    this.isIrSignalRecorded = false;

    let params: IrSignalPageNavParams = this.navParams.get(NAV_PARAMS_PARAM_NAME);
    if (params) {
      this.irSignal = params.irSignal;
      this.nameInputValue = this.irSignal.name;
      this.sleepInputValue = String(this.irSignal.sleep);
    }    

  }

  ionViewWillEnter() {
    console.log("IrSignalPage.ionViewWillEnter()");    
    this.redisProvider.initialize().then(() => {
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
        // TODO 停止されたことの確認が必要
        this.redisProvider.publish('stop_ir_receiving', 'test').then(() => {
          console.log('stop_ir_receiving publish success');
        }).catch((reason)=>{
          console.log('stop_ir_receiving publish error:', reason);
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
    // TODO webdisを使う場合メッセージごとにチャンネルを使う今の方式だと
    // コネクション数の上限に達してしまうのでチャンネルを統合する

    this.redisProvider.subscribe('started_ir_receiving', (message) => {
      this.irReceivingState = IrReceivingState.Receiving;
      this.irReceivingMessage = '記録したいリモコンのボタンをneochiに向けて押してください';
    }, (error) => {
    });
    /*
    this.redisProvider.subscribe('stopped_ir_receiving_no_signal', (message) => {
      this.irReceivingState = IrReceivingState.Ready;
      this.irReceivingMessage = 'タイムアウトで記録を中止しました';
    }, (error) => {
    });
    this.redisProvider.subscribe('stopped_ir_receiving_invalid_signal', (message) => {
      this.irReceivingState = IrReceivingState.Ready;
      this.irReceivingMessage = '不正な信号で記録を中止しました';
    }, (error) => {
    });
    */
   this.redisProvider.subscribe('stopped_ir_receiving_valid_signal', (message) => {
      this.irReceivingState = IrReceivingState.Ready;
      this.irReceivingMessage = '記録が完了しました';

      this.areContentsChanged = true;
      this.isIrSignalRecorded = true;
    }, (error) => {
    });
    this.redisProvider.subscribe('stopped_ir_receiving_stop_message', (message) => {
      this.irReceivingState = IrReceivingState.Ready;
      this.irReceivingMessage = '記録を中止しました';
    }, (error) => {
    });
    /*
    this.redisProvider.subscribe('stopped_ir_receiving_more_signal', (message) => {
    }, (error) => {
    });
    this.redisProvider.subscribe('stopped_ir_saving', (message) => {
    }, (error) => {
    });
    this.redisProvider.subscribe('stopped_ir_saving_error', (message) => {
    }, (error) => {
    });
    this.redisProvider.subscribe('stopped_discarding', (message) => {
    }, (error) => {
    });
    this.redisProvider.subscribe('stopped_discarding_error', (message) => {
    }, (error) => {
    });
    */
  }

  getIrReceivingMessage(): string {

    if (this.irReceivingState === IrReceivingState.Ready) {
      return '';
    } else if (this.irReceivingState === IrReceivingState.Error) {
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
    if (this.irSignal && this.irSignal.id) {
      // TODO 確認して削除して前の画面に戻る
      this.redisProvider.publish('delete_ir_signal', String(this.irSignal.id)).then(() => {
      }).catch((reason)=>{
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
      id: this.irSignal.id,
      name: this.nameInputValue,
      sleep: Number(this.sleepInputValue),
    }
    this.redisProvider.publish('save_ir_signal', JSON.stringify(message)).then(() => {
      // TODO 保存完了のメッセージを受けて前の画面に戻る
      // TODO 保存完了のメッセージを受けたらthis.irSignalの内容を書き換える
    }).catch((reason)=>{
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
      this.redisProvider.publish('start_ir_receiving', 'test').then(() => {
        console.log('start_ir_receiving publish success');
      }).catch((reason)=>{
        console.log('start_ir_receiving publish error:', reason);
      });
    } else if (this.irReceivingState === IrReceivingState.Receiving) {
      console.log('stop_ir_receiving');
      this.redisProvider.publish('stop_ir_receiving', 'test').then(() => {
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

  /*
  TODO
  画面を抜けるときに
  areContentsChanged 見て変更があれば保存するか問う
  */
}
