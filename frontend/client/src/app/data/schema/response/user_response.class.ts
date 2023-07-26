export class UserResponse {
  uuid: string;
  name: string;
  email: string;
  avatar: string | null;
  roles: string[];

  constructor(uuid: string, name: string, email: string, avatar: string | null, roles: string[]) {
    this.uuid = uuid;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.roles = roles;
  }
}
