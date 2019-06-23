import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IrSignalPage } from './ir-signal';

@NgModule({
  declarations: [
    IrSignalPage,
  ],
  imports: [
    IonicPageModule.forChild(IrSignalPage),
  ],
})
export class IrSignalPageModule {}
