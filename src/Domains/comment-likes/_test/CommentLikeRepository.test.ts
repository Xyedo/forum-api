import CommentLikeRepository from "../CommentLikeRepository";

describe("commentLikerepository Interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    const commentLikeRepo = new CommentLikeRepository();
    await expect(commentLikeRepo.toogleLike("", "")).rejects.toThrowError(
      "COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
