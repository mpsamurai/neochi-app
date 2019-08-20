import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSetListPage } from './data-set-list';

@NgModule({
  declarations: [
    DataSetListPage,
  ],
  imports: [
    IonicPageModule.forChild(DataSetListPage),
  ],
})
export class DataSetListPageModule {}
