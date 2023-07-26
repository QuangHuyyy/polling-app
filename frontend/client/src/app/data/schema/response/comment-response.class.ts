export class CommentResponse {
  id: number;
  name: string;
  avatarUrl: string;
  userUuid: string;
  message: string;
  parentId: number;
  oldParentId: number;
  createdAt: string;
  levelComment: number;
  replies: CommentResponse[];

  constructor(
    id: number,
    name: string,
    avatarUrl: string,
    userUuid: string,
    message: string,
    parentId: number,
    oldParentId: number,
    createdAt: string,
    levelComment: number,
    replies: CommentResponse[]
  ) {
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.userUuid = userUuid;
    this.message = message;
    this.parentId = parentId;
    this.oldParentId = oldParentId;
    this.createdAt = createdAt;
    this.levelComment = levelComment;
    this.replies = replies;
  }
}
