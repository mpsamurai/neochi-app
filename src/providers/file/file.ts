import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileEntry } from '@ionic-native/file/ngx';

/*
  Generated class for the FileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileProvider {

  public static readonly DATA_SETS_DIRECTORY_NAME = 'data-sets';
  public static readonly LABELS_FILE_NAME = 'labels.json';

  constructor(public http: HttpClient) {
    console.log('Hello FileProvider Provider');
  }

  writeObjectToFile(fileEntry: FileEntry, object: Object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function() {
          resolve();
        };
        fileWriter.onerror = function (e) {
          reject(e);
        };
        fileWriter.onabort = function (e) {
          reject(e);
        };
        var jsonStr = JSON.stringify(object);
        var blob = new Blob([jsonStr], {type: "application/json"});
        fileWriter.write(blob);
      });      
    });
  }  

  readObjectFromFile(fileEntry: FileEntry): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      fileEntry.file(function (file) {
        var reader = new FileReader();
  
        reader.onloadend = function() {
          resolve(JSON.parse(String(this.result)));
        };
        reader.onerror = function (e) {
          reject(e);
        };
        reader.onabort = function (e) {
          reject(e);
        };  
        reader.readAsText(file);  
      }, function (e) {
        reject(e);
      });
    });    
  }
  
  
}
