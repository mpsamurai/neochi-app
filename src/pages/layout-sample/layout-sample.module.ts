import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LayoutSamplePage } from './layout-sample';

@NgModule({
  declarations: [
    LayoutSamplePage,
  ],
  imports: [
    IonicPageModule.forChild(LayoutSamplePage),
  ],
})
export class LayoutSamplePageModule {}
