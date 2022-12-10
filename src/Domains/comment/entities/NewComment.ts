import { Payload, ThreadComment } from "../../../Commons/types";

export default class NewComment {
  public userId: string;

  public threadId: string;

  public content: string;

  constructor(payload: Payload) {
    NewComment.validatePayload(payload);
    const { userId, threadId, content } = payload as unknown as ThreadComment;
    this.userId = userId;
    this.threadId = threadId;
    this.content = content;
  }

  private static validatePayload(payload: Payload) {
    const { userId, threadId, content } = payload;
    if (!userId || !threadId || !content) {
      throw new Error("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      !(
        typeof threadId === "string" &&
        typeof content === "string" &&
        typeof userId === "string"
      )
    ) {
      throw new Error("NEW_COMMENT.NOT_EXPECTED_VALUE_TYPE");
    }
  }
}
