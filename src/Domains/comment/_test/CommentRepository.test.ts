import CommentRepository from "../CommentRepository";

describe("CommentRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    const commentRepository = new CommentRepository();
    await expect(
      commentRepository.addCommentToThread({} as any)
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(commentRepository.deleteCommentById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(
      commentRepository.verifyCommentOwner("","")
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      commentRepository.verifyCommentAvaibility("")
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
