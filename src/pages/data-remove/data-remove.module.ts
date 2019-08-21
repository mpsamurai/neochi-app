import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataRemovePage } from './data-remove';

@NgModule({
  declarations: [
    DataRemovePage,
  ],
  imports: [
    IonicPageModule.forChild(DataRemovePage),
  ],
})
export class DataRemovePageModule {}
