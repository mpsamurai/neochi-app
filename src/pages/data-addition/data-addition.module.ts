import { File } from '@ionic-native/file';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DataAdditionPage } from './data-addition';

@NgModule({
  declarations: [
    DataAdditionPage,
  ],
  imports: [
    IonicPageModule.forChild(DataAdditionPage),
  ],
  providers: [
    File,
  ]
})
export class DataAdditionPageModule {}
