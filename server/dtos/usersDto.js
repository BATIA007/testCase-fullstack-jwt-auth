export default class UsersDto {
  email;
  created;

  constructor(model) {
    this.email = model.email
    this.created = model.created
  }
}