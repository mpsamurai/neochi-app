import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedisProvider } from '../../providers/redis/redis';

/**
 * Generated class for the RedisSamplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-redis-sample',
  templateUrl: 'redis-sample.html',
})
export class RedisSamplePage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private redisProvider: RedisProvider) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.redisProvider.initialize().then(() => {
    }).catch(() => {
    });
  }

  ionViewWillLeave() {
    this.redisProvider.finalize().then(() => {
    }).catch(() => {
    });    
  }

  async onClickGetValue() {
    const value = await this.redisProvider.getStringValue('key');
    console.log('value:', value);
  }

  async onClickSetValue() {
    await this.redisProvider.setStringValue('key', 'my value');
  }

  async onClickPublish() {
    await this.redisProvider.publish('channel', 'message');
  }

  onClickSubscribe() {
    this.redisProvider.subscribe('channel', (message) => {
      console.log('message:', message);      
    }, (error) => {
      console.log('error:', error);
    });
  }



}
