import { Component } from '@angular/core';
import { IndexPageComponent as DetectionIndexPageComponent } from '../../pages/detection/index/index.component';
import { IndexPageComponent as ActionIndexPageComponent } from '../../pages/action/index/index.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = 'HomePage';
  tab2Root = DetectionIndexPageComponent;
  tab3Root = 'IrSignalListPage';
  tab4Root = ActionIndexPageComponent;

  constructor() {
  }
}
