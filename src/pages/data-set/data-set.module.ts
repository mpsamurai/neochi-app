import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSetPage } from './data-set';

@NgModule({
  declarations: [
    DataSetPage,
  ],
  imports: [
    IonicPageModule.forChild(DataSetPage),
  ],
})
export class DataSetPageModule {}
