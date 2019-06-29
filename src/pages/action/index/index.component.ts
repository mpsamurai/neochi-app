import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShowPageComponent } from '../show/show.component';
import { RedisProvider } from '../../../providers/redis/redis';
import { ActionSet } from '../../../interfaces/action-set';
import { NAV_PARAMS_PARAM_NAME, ActionSetPageNavParams } from '../../../interfaces/neochi';
import { NeochiProvider } from '../../../providers/neochi/neochi';

enum PageState {
  Booting,
  Ready,
  Error
}

@Component({
  selector: 'page-action-index',
  templateUrl: './index.component.html'
})
export class IndexPageComponent {
  pageStateEnum: typeof PageState = PageState;

  private static readonly DEFAULT_ACTION_JSON = {
    actionSets: [
      {id: 0, name: "寝落ち検出時", actions: []},
      {id: 1, name: "拍手検出時", actions: []},
    ]
  }

  pageState: PageState;
  actionSets: ActionSet[];

  constructor(
    public navCtrl: NavController,
    private redisProvider: RedisProvider,
    private neochiProvider: NeochiProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
    this.pageState = PageState.Booting;
    this.actionSets = [];
  }

  ionViewWillEnter() {
    console.log("IrSignalListPage.ionViewWillEnter()");
    this.redisProvider.initialize(this.neochiProvider.getNeochiIpAddress()).then(() => {
      this.updateActionSetList();
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    console.log("IrSignalListPage.ionViewWillLeave()");        
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  async updateActionSetList() {
    let json: object;
    try {
      json = await this.redisProvider.getJsonValue('neochi-app:action');
      if (json === null) {
        json = IndexPageComponent.DEFAULT_ACTION_JSON;
        await this.redisProvider.setJsonValue('neochi-app:action', json);
      }
    } catch (error) {
      console.log("updateActionSetList() error:", error);
      this.pageState = PageState.Error;
      this.actionSets = [];
      return;
    }

    this.actionSets = [];
    json['actionSets'].forEach(actionSetObject => {
      let actionSet: ActionSet = {
        id: actionSetObject['id'],
        name: actionSetObject['name'],
        actions: [],
      };
      this.actionSets.push(actionSet);
    });
    this.pageState = PageState.Ready;
  }

  onClickActionSet(actionSet: ActionSet) {
    let params: ActionSetPageNavParams = {
      id: actionSet.id,
    };    
    this.navCtrl.push(ShowPageComponent, {[NAV_PARAMS_PARAM_NAME]: params});
  }
}
