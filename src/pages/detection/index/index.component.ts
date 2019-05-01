import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Dataset, SingleData } from '../../../models/detection.model';
import { ShowPageComponent } from '../show/show.component';

@Component({
  selector: 'page-detecion-index',
  templateUrl: './index.component.html'
})
export class IndexPageComponent {

  datasets: Dataset[] = [
    new Dataset(1, '順也',
    [new SingleData("","","","sleeping"),new SingleData("","","","awake")]),
    new Dataset(1, '順也',
    [new SingleData("","","","sleeping"),new SingleData("","","","awake")])];


  constructor(
    public navCtrl: NavController,
  ) { }

  onDetectionClicked(dataset: Dataset) {
    this.navCtrl.push(ShowPageComponent, {
      dataset: dataset,
    });
  }
  onDetectionAdd() {
    this.navCtrl.push(ShowPageComponent, {
      dataset: new Dataset(3, '（新規）',
      [new SingleData("","","","sleeping"),new SingleData("","","","awake")])
    });
  }
}
