export class Comment {
  constructor(
    public _id : number = -1,
    public _idNews : number = -1,
    public _idUser : number = -1,
    public timestamp : Date = new Date(),
    public comment : string = ''
  ) { }
}
