export class News {
  constructor(
    public _id : number = -1,
    public author : number = -1,
    public title : string = '',
    public category : string = '',
    public timestamp : Date = new Date(),
    public summary : string = '',
    public article : string = '',
    public photo : string = ''
  ) { }

}
