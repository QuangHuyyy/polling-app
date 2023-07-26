export class CommentRequest {
  userUuid: string;
  name: string;
  parentId: number = 0;
  message: string;

  constructor(userUuid: string, name: string, message: string, parentId: number) {
    this.userUuid = userUuid;
    this.name = name;
    this.parentId = parentId;
    this.message = message;
  }
}
