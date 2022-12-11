import { CommentLikePayload } from "src/Commons/types";

export default class AddCommentLikes {
  public userId: string;

  public commentId: string;

  public threadId: string;

  constructor(payload: CommentLikePayload) {
    AddCommentLikes.validatePayload(payload);
    const { userId, commentId, threadId } = payload;
    this.userId = userId as string;
    this.commentId = commentId as string;
    this.threadId = threadId as string;
  }

  private static validatePayload(payload: CommentLikePayload) {
    const { userId, commentId, threadId } = payload;
    if (!userId || !commentId || !threadId) {
      throw new Error("NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      !(
        typeof userId === "string" &&
        typeof commentId === "string" &&
        typeof threadId === "string"
      )
    ) {
      throw new Error("NEW_COMMENT_LIKE.INVALID_TYPE");
    }
  }
}
