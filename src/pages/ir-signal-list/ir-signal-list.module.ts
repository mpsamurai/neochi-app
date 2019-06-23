import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IrSignalListPage } from './ir-signal-list';

@NgModule({
  declarations: [
    IrSignalListPage,
  ],
  imports: [
    IonicPageModule.forChild(IrSignalListPage),
  ],
})
export class IrSignalListPageModule {}
