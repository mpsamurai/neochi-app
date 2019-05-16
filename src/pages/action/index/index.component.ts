import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShowPageComponent } from '../show/show.component';
import { Action } from '../../../models/action.model';

@Component({
  selector: 'page-action-index',
  templateUrl: './index.component.html'
})
export class IndexPageComponent {

  actions: Action[] = [
    new Action(1, '寝落ち検出時', [1,3]),
    new Action(2, '拍手検出時', [1,3]),
  ];

  actionMap: { [key: number]: string; } = {};


  constructor(
    public navCtrl: NavController
  ) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }
  onActionClicked(action: Action) {
    this.navCtrl.push(ShowPageComponent, {
      action: action,
    });
  }
}
