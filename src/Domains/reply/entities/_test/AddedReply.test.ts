import AddedReply from "../AddedReply";

describe("a AddedReply entities", () => {
  it("should throw error when payload didnt contain needed properties", () => {
    const payload = {
      id: "thread-123",
      content: "gatau kak",
    };
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPS"
    );
  });
  it("should throw error when payload didnt meet data type specs", () => {
    const payload = {
      id: "thread-123",
      content: "gatau kak",
      owner: 10934,
    };
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_MEET_THE_REQS_DATA_TYPES"
    );
  });
  it("should get the AddedReply object correctly", () => {
    const payload = {
      id: "thread-123",
      content: "gatau kak",
      owner: "user-14812",
    };
    const { content, id, owner } = new AddedReply(payload);
    expect(content).toEqual(payload.content);
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
  });
});
