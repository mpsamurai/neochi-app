import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RedisSamplePage } from './redis-sample';

@NgModule({
  declarations: [
    RedisSamplePage,
  ],
  imports: [
    IonicPageModule.forChild(RedisSamplePage),
  ],
})
export class RedisSamplePageModule {}
