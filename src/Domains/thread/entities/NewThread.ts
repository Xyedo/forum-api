import { Payload, Thread } from "src/Commons/types";

class NewThread {
  public userId: string;

  public title: string;

  public body: string;

  constructor(payload: Payload) {
    NewThread.verifyPayload(payload);
    const { userId, title, body } = payload as unknown as Thread;
    this.userId = userId;
    this.title = title;
    this.body = body;
  }

  private static verifyPayload(payload: Payload) {
    const { userId, title, body } = payload;
    if (!userId || !title || !body) {
      throw new Error("NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      !(
        typeof userId === "string" &&
        typeof title === "string" &&
        typeof body === "string"
      )
    ) {
      throw new Error("NEW_THREAD.INVALID_TYPE");
    }
    if (title.length >= 128) {
      throw new Error("NEW_THREAD.MAX_LENGTH_OF_TITLE_IS_128");
    }
  }
}

export default NewThread;
