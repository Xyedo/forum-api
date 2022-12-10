import NewReply from "../NewReply";

describe("a NewReply entities", () => {
  it("should throw error when payload didnt contain needed properties", () => {
    const payload = {
      commentId: "comment-123",
      threadId: "thread-123",
    };
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload didnt meet data type specs", () => {
    const payload = {
      commentId: "comment-123",
      threadId: "thread-123",
      userId: "user-123",
      content: 123,
    };
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_EXPECTED_VALUE_TYPE"
    );
  });
  it("should create NewComment object correctly", () => {
    const payload = {
      commentId: "comment-123",
      threadId: "thread-123",
      userId: "user-123",
      content: "cool-cool-cool",
    };
    const { userId, threadId, content, commentId } = new NewReply(payload);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
  });
});
