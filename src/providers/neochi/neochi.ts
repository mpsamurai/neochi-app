import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the NeochiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NeochiProvider {

  private static readonly DEFAULT_NEOCHI_IP_ADDRESS = '192.168.0.20';

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
}
