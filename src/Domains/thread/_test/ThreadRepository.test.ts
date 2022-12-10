import ThreadRepository from "../ThreadRepository";

describe("ForumRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.addNewThread("" as any)).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(threadRepository.verifyThreadAvaibility("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.getThreadDetailById("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    
  });
});
