import { Component } from '@angular/core';
import { HomePageComponet as HomePageComponet } from "../../pages/home/main/main.component";
import { IndexPageComponent as DetectionIndexPageComponent } from '../../pages/detection/index/index.component';
import { IndexPageComponent as ActionIndexPageComponent } from '../../pages/action/index/index.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = HomePageComponet;
  tab2Root = DetectionIndexPageComponent;
  tab3Root = 'IrSignalListPage';
  tab4Root = ActionIndexPageComponent;

  constructor() {
  }
}
