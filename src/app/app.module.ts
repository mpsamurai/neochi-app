import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { RemoconPage } from '../pages/remocon/remocon';
import { DetectionPage } from '../pages/detection/detection';
import { HomePage } from '../pages/home/home';
import { ActionPage } from '../pages/action/action';
import { TabsPage } from '../pages/tabs/tabs';

import { DetectionDetailPage} from '../pages/detection-detail/detection-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NeochiRedisServiceProvider } from '../providers/neochi-redis-service/neochi-redis-service';

@NgModule({
  declarations: [
    MyApp,
    RemoconPage,
    DetectionPage,
    HomePage,
    ActionPage,
    TabsPage,
    DetectionDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RemoconPage,
    DetectionPage,
    HomePage,
    ActionPage,
    TabsPage,
    DetectionDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NeochiRedisServiceProvider
  ]
})
export class AppModule {}
