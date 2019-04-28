import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetectionDetailPage } from './detection-detail';

@NgModule({
  declarations: [
    DetectionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DetectionDetailPage),
  ],
})
export class DetectionDetailPageModule {}
