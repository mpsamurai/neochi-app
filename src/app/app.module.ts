import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';

import components from './components';
import { RedisProvider } from '../providers/redis/redis';

import { HttpClientModule } from '@angular/common/http';
import { TabsPage } from '../pages/tabs/tabs';
import { ImageProvider } from '../providers/image/image';
import { NeochiProvider } from '../providers/neochi/neochi';

@NgModule({
  declarations: [
    MyApp,
    ...components,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ...components,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RedisProvider,
    ImageProvider,
    NeochiProvider
  ]
})
export class AppModule {}
