import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare const cordova: any;

/*
  Generated class for the RedisProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RedisProvider {

  private static readonly REDIS_HOST = 'localhost';
  private static readonly REDIS_PORT = 6379;
  private static readonly WEBDIS_HOST = 'localhost';
  private static readonly WEBDIS_PORT = 7379;

  constructor(public http: HttpClient,
    private platform: Platform) {
    console.log('Hello RedisProvider Provider');
  }

  initialize(host, port, success, error): Promise<void> {
    if (this.platform.is('cordova')) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.initialize(
          RedisProvider.REDIS_HOST,
          RedisProvider.REDIS_PORT,
          (winParam) => {
            resolve();
          }, (error) => {
            reject(error);
          });
      });
    }
  }

  setStringValue(key, value, success, error) {
  }

  setIntegerValue(key, value, success, error) {
  }

  setJsonValue(key, value, success, error) {
  }

  getStringValue(key: string): Promise<void> {
    if (this.platform.is('cordova')) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.initialize(
          RedisProvider.REDIS_HOST, 
          RedisProvider.REDIS_PORT,
          (winParam) => {
            resolve();
          }, (error) => {
            reject(error);
          });
      });
    } else {
      // Webdis 経由でアクセスする
      this.http.get('http://' + RedisProvider.WEBDIS_HOST + ':' + RedisProvider.WEBDIS_PORT + '/GET/' + key).subscribe(data => {
      }, (error) => {
      });
    }
  }

  getIntegerValue(key, success, error) {
  }

  getJsonValue(key, success, error) {
  }

  publish(channel, message, success, error) {
  }

  subscribe(channel, success, error) {
  }

  unsubscribe(channel, success, error) {
  }

  finalize(success, error) {
  }

}
