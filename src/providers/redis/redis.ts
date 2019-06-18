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

  private static readonly REDIS_HOST = '192.168.0.20';
  private static readonly REDIS_PORT = 6379;
  private static readonly WEBDIS_HOST = '192.168.0.20';
  private static readonly WEBDIS_PORT = 7379;

  subXhrDict = {};

  constructor(public http: HttpClient,
    private platform: Platform) {
    console.log('Hello RedisProvider Provider');
  }

  private getWebdisBaseUrl(): string {
    return 'http://' + RedisProvider.WEBDIS_HOST + ':' + RedisProvider.WEBDIS_PORT;
  }

  async initialize(): Promise<void> {
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

  async setStringValue(key, value): Promise<void> {
    if (this.platform.is('cordova')) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.setStringValue(
          key, value, 
          (winParam) => {
            resolve();
          }, (error) => {
            reject(error);
          });
      });
    } else {
      return new Promise<void>((resolve, reject) => {
        // Webdis 経由でアクセスする
        const url = this.getWebdisBaseUrl() + '/SET/' + encodeURIComponent(key) + '/' + encodeURIComponent(value);
        this.http.get(url).subscribe<any>(data => {
          console.log('data:', data);        
          resolve();
        }, (error) => {
          reject(error);
        });
      });
    }    
  }

  async setIntegerValue(key: string, value: number): Promise<void> {
    await this.setStringValue(key, String(value));
  }

  async setJsonValue(key: string, value: object): Promise<void> {
    await this.setStringValue(key, JSON.stringify(value));
  }

  async getStringValue(key: string): Promise<string> {
    if (this.platform.is('cordova')) {
      return new Promise<string>((resolve, reject) => {
        cordova.plugins.Redis.getStringValue(
          key, 
          (winParam) => {
            resolve(winParam);
          }, (error) => {
            reject(error);
          });
      });
    } else {
      return new Promise<string>((resolve, reject) => {
        // Webdis 経由でアクセスする
        const url = this.getWebdisBaseUrl() + '/GET/' + encodeURIComponent(key) + '.txt';
        this.http.get(url).subscribe<any>(data => {
          console.log('data:', data);        
          resolve(data);
        }, (error) => {
          reject(error);
        });
      });
    }
  }

  async getIntegerValue(key: string): Promise<number> {
    const stringValue = await this.getStringValue(key);
    return Number(stringValue);
  }

  async getJsonValue(key: string): Promise<object> {
    const stringValue = await this.getStringValue(key);
    return JSON.parse(stringValue);
  }

  async publish(channel: string, message: string): Promise<void> {
    if (this.platform.is('cordova')) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.publish(channel, message, 
          (winParam) => {
            resolve();
          }, (error) => {
            reject(error);
          });
      });      
    } else {
      return new Promise<void>((resolve, reject) => {
        // Webdis 経由でアクセスする
        const url = this.getWebdisBaseUrl() + '/PUBLISH/' + encodeURIComponent(channel) + '/' + encodeURIComponent(message);
        this.http.get(url).subscribe<any>(data => {
          console.log('data:', data);
          resolve();
        }, (error) => {
          reject(error);
        });
      });
    }    
  }

  subscribe(channel: string, success: (message: string) => void, error: (error: any) => void) {
    if (this.platform.is('cordova')) {
      cordova.plugins.Redis.subscribe(
        channel,
        (winParam) => {
          success(winParam);
        }, (error) => {
          error(error);
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
                success(array[2]);
              }
            }
        };
        xhr.send(null);
        this.subXhrDict[channel] = xhr;
      } catch (e) {
        error(e);
      }
    }
  }

  async unsubscribe(channel): Promise<void> {
    if (this.platform.is('cordova')) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.unsubscribe(
          channel, 
          (winParam) => {
            resolve();
          }, (error) => {
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
    if (this.platform.is('cordova')) {
      return new Promise<void>((resolve, reject) => {
        cordova.plugins.Redis.finalize(
          (winParam) => {
            resolve();
          }, (error) => {
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
