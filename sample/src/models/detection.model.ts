export class SingleData {
  constructor(
    public thumbnailFilePath: string,
    public imageFilePath: string,
    public timeStamp: string,
    public tag: string
  ) {}
}
export class Dataset {
  constructor(
    public id: number,
    public name: string,
    public dataArray: SingleData[]
  ) {}
}

