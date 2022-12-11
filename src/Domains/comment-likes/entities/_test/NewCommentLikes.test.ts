import NewCommentLikes from "../NewCommentLikes";

describe("a NewCommentLikes entities", () => {
  it("should throw error when payload didnt contain needed properties", () => {
    const payload = {
      userId: "user-123",
    };
    expect(() => new NewCommentLikes(payload)).toThrowError(
      "NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload didnt meet data type specs", () => {
    const payload = {
      userId: "user-138",
      threadId:"thread-123",
      commentId: 123,
    };
    expect(() => new NewCommentLikes(payload as any)).toThrowError(
      "NEW_COMMENT_LIKE.INVALID_TYPE"
    );
  });
  it("should create NewComment object correctly", () => {
    const payload = {
      threadId:"thread-123",
      commentId: "comment-190asd",
      userId: "user-123",
    };
    const { userId, commentId } = new NewCommentLikes(payload);
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
