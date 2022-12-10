import AddedComment from "../AddedComment";

describe("a AddedComment entities", () => {
  it("should throw error when payload didnt contain needed properties", () => {
    const payload = {
      id: "thread-123",
      content: "gatau kak",
    };
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPS"
    );
  });
  it("should throw error when payload didnt meet data type specs", () => {
    const payload = {
      id: "thread-123",
      content: "gatau kak",
      owner: 10934,
    };
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_THE_REQS_DATA_TYPES"
    );
  });
  it("should get the addedComment object correctly", () => {
    const payload = {
      id: "thread-123",
      content: "gatau kak",
      owner: "user-14812",
    };
    const { content, id, owner } = new AddedComment(payload);
    expect(content).toEqual(payload.content);
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
  });
});
