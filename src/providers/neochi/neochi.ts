import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSet } from '../../interfaces/neochi';

/*
  Generated class for the NeochiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NeochiProvider {

  private static readonly DEFAULT_NEOCHI_IP_ADDRESS = '192.168.0.20';
  private static readonly DEFAULT_WEB_API_BASE_URL = 'http://192.168.0.13/';

  public static readonly UPLOAD_DATA_API_URL = 'data/upload';
  public static readonly FIT_MODELS_API_URL = 'models/fit';
  public static readonly DOWNLOAD_MODELS_API_URL = 'models/download';


  constructor(public http: HttpClient) {
    console.log('Hello NeochiProvider Provider');
  }

  getDefaultNeochiIpAddress(): string {
    return NeochiProvider.DEFAULT_NEOCHI_IP_ADDRESS;
  }

  getNeochiIpAddress(): string {
    let ipAddress = localStorage.getItem('neochiIpAddress');
    if (!ipAddress) {
      ipAddress = NeochiProvider.DEFAULT_NEOCHI_IP_ADDRESS;
    }
    return ipAddress;
  }

  setNeochiIpAddress(ipAddress: string) {
    localStorage.setItem('neochiIpAddress', ipAddress);
  }

  getDefaultWebApiBaseUrl(): string {
    return NeochiProvider.DEFAULT_WEB_API_BASE_URL;
  }

  getWebApiBaseUrl(): string {
    let ipAddress = localStorage.getItem('webApiBaseUrl');
    if (!ipAddress) {
      ipAddress = NeochiProvider.DEFAULT_WEB_API_BASE_URL;
    }
    return ipAddress;
  }

  setWebApiBaseUrl(ipAddress: string) {
    localStorage.setItem('webApiBaseUrl', ipAddress);
  }

  getDataSets(): DataSet[] {
    let dataSets = [];
    let jsonString = localStorage.getItem('dataSets');
    if (jsonString !== null) {
      let json = JSON.parse(jsonString);
      if (json.hasOwnProperty('dataSets')) {
        dataSets = json.dataSets;
      }
    }
    return dataSets;
  }

  setDataSets(dataSets: DataSet[]) {
    const object = { 
      dataSets: dataSets
    };
    localStorage.setItem('dataSets', JSON.stringify(object));
  }  

}
