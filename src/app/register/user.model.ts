export class User {
  constructor(
    public _id : number = -1,
    public username : string = '',
    public password : string = '',
    public firstname : string = '',
    public lastname : string = '',
    public email : string = '',
    public level : number = -1,
    public salt : string = ''
  ) { }
}
