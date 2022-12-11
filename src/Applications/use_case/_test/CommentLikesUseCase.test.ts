import CommentLikeRepository from "../../../Domains/comment-likes/CommentLikeRepository";
import CommentRepository from "../../../Domains/comment/CommentRepository";
import ThreadRepository from "../../../Domains/thread/ThreadRepository";
import CommentLikesUseCase from "../CommentLikesUseCase";

describe("CommentLikeUseCase", () => {
  describe("toogleLike", () => {
    it("should orchestrating toogle action correctly", async () => {
      // arrange
      const useCasePayload = {
        threadId: "thread-194",
        commentId: "comment-123",
        userId: "user-123",
      };
      const mockThreadRepo = new ThreadRepository();

      mockThreadRepo.verifyThreadAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const mockCommentRepo = new CommentRepository();
      mockCommentRepo.verifyCommentAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const mockCommentLikeRepo = new CommentLikeRepository();
      mockCommentLikeRepo.toogleLike = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ id: "likes-123", likes: true })
        );

      const commentLikesUseCase = new CommentLikesUseCase({
        commentLikeRepository: mockCommentLikeRepo,
        commentRepository: mockCommentRepo,
        threadRepository: mockThreadRepo,
      });
      // action
      await expect(
        commentLikesUseCase.toogleLikes(useCasePayload)
      ).resolves.not.toThrow(Error);

      // assert
      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepo.verifyCommentAvaibility).toBeCalledWith(
        useCasePayload.commentId
      );
      expect(mockCommentLikeRepo.toogleLike).toBeCalledWith(
        useCasePayload.userId,
        useCasePayload.commentId,
      );
    });
  });
});
