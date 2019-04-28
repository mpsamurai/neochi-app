import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetectionDetailPage } from '../detection-detail/detection-detail';

@Component({
  selector: 'page-ditection',
  templateUrl: 'detection.html'
})
export class DetectionPage {

  items: {
    title: string,
    body: string
  }[]; 
  constructor(public navCtrl: NavController) {
      this.items = [
          { title: '順也' ,body: '内容1'},
          { title: '航' ,body: '内容2'},
          { title: 'Mikechel',body: '内容3'}
      ];
  }
  openNavDetailsPage(item) {
    this.navCtrl.push(DetectionDetailPage, { item: item });
  }
  ionViewDidLoad() {
      console.log('ionViewDidLoad NewsPage');
  }
}
