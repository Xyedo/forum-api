import { Payload } from "src/Commons/types";

type AddedThreadPayload = {
  id: string;
  title: string;
  owner: string;
};
class AddedThread {
  public id: string;

  public title: string;

  public owner: string;

  constructor(payload: Payload) {
    AddedThread.validatePayload(payload);
    const { id, title, owner } = payload as unknown as AddedThreadPayload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  private static validatePayload(payload: Payload) {
    const { id, title, owner } = payload;
    if (!id || !title || !owner) {
      throw new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPS");
    }
    if (
      !(
        typeof id === "string" &&
        typeof title === "string" &&
        typeof owner === "string"
      )
    ) {
      throw new Error("ADDED_THREAD.NOT_MEET_THE_REQS_DATA_TYPES");
    }
  }
}

export default AddedThread;
