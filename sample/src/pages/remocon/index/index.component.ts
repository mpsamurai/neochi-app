import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Remocon } from '../../../models/remocon.model';
import { ShowPageComponent } from '../show/show.component';

@Component({
  selector: 'page-remocon-index',
  templateUrl: './index.component.html'
})
export class IndexPageComponent {

  remocons: Remocon[] = [
    new Remocon(1, '部屋の照明 ON', 0.5, '記録済', '5/1 11:05'),
    new Remocon(2, '部屋の照明 OFF', 0.5, '記録済', '5/1 11:15'),
    new Remocon(3, 'エアコン ON', 0.7, '記録済', '4/28 18:01')
  ];


  private IR_KEY = "r-receiver:ir";

  constructor(
    public navCtrl: NavController,
  ) { }

  onRemoconClicked(remocon: Remocon) {
    this.navCtrl.push(ShowPageComponent, {
      remocon: remocon,
    });
  }

  onRemoconAdd() {
    this.navCtrl.push(ShowPageComponent, {
      remocon: new Remocon(4, '', 0, '', '')
    });
  }
}
