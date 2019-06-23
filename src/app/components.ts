// Navigations
import { TabsComponent } from '../navigations/tabs/tabs.component';

import { HomePageComponet } from "../pages/home/main/main.component";
import { ConfigPageComponent } from "../pages/home/conf/conf.component";
import { IndexPageComponent as ActionIndexPageComponent } from '../pages/action/index/index.component';
import { ShowPageComponent as ActionShowPageComponent } from '../pages/action/show/show.component';
import { IndexPageComponent as DetectionIndexPageComponent } from '../pages/detection/index/index.component';
import { ShowPageComponent as DetectionShowPageComponent } from '../pages/detection/show/show.component';

export default [
  TabsComponent,
  HomePageComponet,
  ConfigPageComponent,
  ActionIndexPageComponent,
  ActionShowPageComponent,
  DetectionIndexPageComponent,
  DetectionShowPageComponent
];
