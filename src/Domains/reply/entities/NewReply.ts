import { Payload, ReplyComment } from "../../../Commons/types";

export default class NewReply {
  public commentId: string;

  public userId: string;

  public threadId: string;

  public content: string;

  constructor(payload: Payload) {
    NewReply.validatePayload(payload);
    const { commentId, content, threadId, userId } =
      payload as unknown as ReplyComment;
    this.commentId = commentId;
    this.content = content;
    this.threadId = threadId;
    this.userId = userId;
  }

  private static validatePayload(payload: Payload) {
    const { commentId, userId, threadId, content } = payload;
    if (!commentId || !userId || !threadId || !content) {
      throw new Error("NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      !(
        typeof commentId === "string" &&
        typeof userId === "string" &&
        typeof threadId === "string" &&
        typeof content === "string"
      )
    ) {
      throw new Error("NEW_REPLY.NOT_EXPECTED_VALUE_TYPE");
    }
  }
}
