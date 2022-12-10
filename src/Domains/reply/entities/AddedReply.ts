import { Payload } from "../../../Commons/types";

type AddedReplyPayload = {
  id: string;
  content: string;
  owner: string;
};
export default class AddedReply {
  public id: string;

  public content: string;

  public owner: string;

  constructor(payload: Payload) {
    AddedReply.validatePayload(payload);
    const { id, content, owner } = payload as unknown as AddedReplyPayload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  private static validatePayload(payload: Payload) {
    const { id, content, owner } = payload;
    if (!id || !content || !owner) {
      throw new Error("ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPS");
    }
    if (
      !(
        typeof id === "string" &&
        typeof content === "string" &&
        typeof owner === "string"
      )
    ) {
      throw new Error("ADDED_REPLY.NOT_MEET_THE_REQS_DATA_TYPES");
    }
  }
}
