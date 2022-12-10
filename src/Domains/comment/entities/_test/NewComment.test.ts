import NewComment from "../NewComment";

describe("a NewComment entities", () => {
  it("should throw error when payload didnt contain needed properties", () => {
    const payload = {
      userId: "user-123",
      threadId: "thread-123",
    };
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload didnt meet data type specs", () => {
    const payload = {
      threadId: "thread-123",
      userId: "user-138",
      content: 123,
    };
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_EXPECTED_VALUE_TYPE"
    );
  });
  it("should create NewComment object correctly", () => {
    const payload = {
      threadId: "thread-190asd",
      userId: "user-123",
      content: "cool-cool-cool",
    };
    const { userId, threadId, content } = new NewComment(payload);
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
  });
});
