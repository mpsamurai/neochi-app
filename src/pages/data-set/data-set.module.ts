import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataSetPage } from './data-set';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [
    DataSetPage,
  ],
  imports: [
    IonicPageModule.forChild(DataSetPage),
  ],
  providers: [
    File,
  ]  
})
export class DataSetPageModule {}
