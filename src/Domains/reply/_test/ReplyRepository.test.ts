import ReplyRepository from "../ReplyRepository";

describe("ReplyRepository interface", () => {
  it("should throw error when not implemented", async () => {
    const replyRepository = new ReplyRepository();
    await expect(
      replyRepository.addReplyToComment({} as any)
    ).rejects.toThrowError("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.deleteReplyById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.verifyReplyOwner("","")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
