import { Component } from '@angular/core';

import { RemoconPage } from '../remocon/remocon';
import { DetectionPage } from '../detection/detection';
import { ActionPage } from '../action/action';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DetectionPage;
  tab3Root = RemoconPage;
  tab4Root = ActionPage;
  constructor() {

  }
}
