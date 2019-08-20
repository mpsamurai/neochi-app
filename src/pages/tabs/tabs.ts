import { Component } from '@angular/core';
import { IndexPageComponent as ActionIndexPageComponent } from '../../pages/action/index/index.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = 'HomePage';
  tab2Root = 'DataSetListPage';
  tab3Root = 'IrSignalListPage';
  tab4Root = ActionIndexPageComponent;

  constructor() {
  }
}
