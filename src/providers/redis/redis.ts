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

  private static readonly REDIS_PORT = 6379;
  private static readonly WEBDIS_PORT = 7379;

  private static readonly USES_WEBDIS = true;

  subXhrDict = {};
  private redisHost: string;
  private webdisHost: string;

  constructor(public http: HttpClient,
    private platform: Platform) {
  }

  private getWebdisBaseUrl(): string {
    return 'http://' + this.webdisHost + ':' + RedisProvider.WEBDIS_PORT;
  }

  async initialize(redisHost: string): Promise<void> {
    this.redisHost = redisHost;
    this.webdisHost = redisHost;
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.initialize(
          this.redisHost,
          RedisProvider.REDIS_PORT,
          (winParam) => {
            console.log('RedisProvider.initialize() winParam:', winParam);
            resolve();
          }, (error) => {
            console.log('RedisProvider.initialize() error:', error);
            reject(error);
          });
      });
    }
  }

  async setStringValue(key, value): Promise<void> {
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.setStringValue(
          key, value, 
          (winParam) => {
            console.log('RedisProvider.setStringValue() winParam:', winParam);
            resolve();
          }, (error) => {
            console.log('RedisProvider.setStringValue() error:', error);
            reject(error);
          });
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        // Webdis 経由でアクセスする
        const url = this.getWebdisBaseUrl() + '/SET/' + encodeURIComponent(key) + '/' + encodeURIComponent(value);
        this.http.get(url).subscribe(data => {
          console.log('data:', data);        
          resolve();
        }, (error) => {
          reject(error);
        });
      });
    }    
  }

  async setNumberValue(key: string, value: number): Promise<void> {
    await this.setStringValue(key, String(value));
  }

  async setJsonValue(key: string, value: object): Promise<void> {
    await this.setStringValue(key, JSON.stringify(value));
  }

  async getStringValue(key: string): Promise<string> {
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      return new Promise<string>((resolve, reject) => {
        cordova.plugins.Redis.getStringValue(
          key, 
          (winParam) => {
            console.log('RedisProvider.getStringValue() winParam:', winParam);
            resolve(winParam);
          }, (error) => {
            console.log('RedisProvider.getStringValue() error:', error);            
            reject(error);
          });
      });
    } else {
      return new Promise<string>((resolve, reject) => {
        // Webdis 経由でアクセスする
        const url = this.getWebdisBaseUrl() + '/GET/' + encodeURIComponent(key) + '.txt';
        this.http.get(url, {responseType: 'text'}).subscribe(data => {
          console.log('data:', data);
          const stringValue = (typeof data === 'string' ? data : '');
          resolve(stringValue);
        }, (error) => {
          // キーが見つからなかった場合はnullを返す
          if (error.hasOwnProperty('status') && error.status === 404) {
            console.log('not found:', error);
            resolve(null);
          } else {
            console.log('error:', error);
            reject(error);  
          }
        });
      });
    }
  }

  async getNumberValue(key: string): Promise<number> {
    const stringValue = await this.getStringValue(key);
    return Number(stringValue);
  }

  async getJsonValue(key: string): Promise<object> {
    const stringValue = await this.getStringValue(key);
    return JSON.parse(stringValue);
  }

  /**
   * 
   * @param channel 
   * @param message nullは使えない
   */
  async publish(channel: string, message: string): Promise<void> {
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.publish(channel, message, 
          (winParam) => {
            console.log('RedisProvider.publish() winParam:', winParam);
            resolve();
          }, (error) => {
            console.log('RedisProvider.publish() error:', error);
            reject(error);
          });
      });      
    } else {
      return new Promise<void>((resolve, reject) => {
        // Webdis 経由でアクセスする
        const url = this.getWebdisBaseUrl() + '/PUBLISH/' + encodeURIComponent(channel) + '/' + encodeURIComponent(message);
        console.log('publish() url:', url);
        this.http.get(url, {responseType: 'json'}).subscribe(data => {
          console.log('data:', data);
          resolve();
        }, (error) => {
          console.log('error:', error);
          reject(error);
        });
      });
    }
  }

  subscribe(channel: string, success: (message: string) => void, error: (error: any) => void) {
    this.unsubscribe(channel).then(() => {
      this.subscribeSub(channel, success, error);
    }).catch((reason) => {
      console.log('RedisProvider.subscribe() error:', error);      
      error(reason);
    });
  }

  private subscribeSub(channel: string, successCallback: (message: string) => void, errorCallback: (error: any) => void) {
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      cordova.plugins.Redis.subscribe(
        channel,
        (winParam) => {
          console.log('RedisProvider.subscribeSub() winParam:', winParam);
          successCallback(winParam);
        }, (error) => {
          console.log('RedisProvider.subscribeSub() error:', error);
          errorCallback(error);
        });
    } else {
      try {
        var previous_response_length = 0
        const xhr = new XMLHttpRequest();
        const url = this.getWebdisBaseUrl() + '/SUBSCRIBE/' + encodeURIComponent(channel);
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 3)  {
              const response = xhr.responseText;
              const chunk = response.slice(previous_response_length);
              previous_response_length = response.length;
              console.log(chunk);
              const json = JSON.parse(chunk);
              const array = json.SUBSCRIBE;
              if (array[0] === 'message') {
                successCallback(array[2]);
              }
            }
        };
        xhr.send(null);
        this.subXhrDict[channel] = xhr;
      } catch (e) {
        errorCallback(e);
      }
    }
  }

  async unsubscribe(channel): Promise<void> {
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.unsubscribe(
          channel, 
          (winParam) => {
            console.log('RedisProvider.unsubscribe() winParam:', winParam);            
            resolve();
          }, (error) => {
            console.log('RedisProvider.unsubscribe() error:', error);
            reject(error);
          });
      });      
    } else {
      if (this.subXhrDict.hasOwnProperty(channel)) {
        const xhr = this.subXhrDict[channel];
        delete this.subXhrDict[channel];
        xhr.abort();
      }
    }
  }

  async finalize(): Promise<void> {
    if (this.platform.is('cordova') && !RedisProvider.USES_WEBDIS) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.finalize(
          (winParam) => {
            console.log('RedisProvider.finalize() winParam:', winParam);
            resolve();
          }, (error) => {
            console.log('RedisProvider.finalize() error:', error);
            reject(error);
          });
      });
    } else {
      for (const channel in this.subXhrDict) {
        if (this.subXhrDict.hasOwnProperty(channel)) {
          await this.unsubscribe(channel);
        }
      }
      this.subXhrDict
    }    
  }

}
