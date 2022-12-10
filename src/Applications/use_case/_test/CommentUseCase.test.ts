import AddedComment from "../../../Domains/comment/entities/AddedComment";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import CommentRepository from "../../../Domains/comment/CommentRepository";
import ThreadRepository from "../../../Domains/thread/ThreadRepository";
import CommentUseCase from "../CommentUseCase";

describe("CommentUseCase", () => {
  describe("addNewCommentToThread", () => {
    it("should orchestrating new comment action correctly", async () => {
      // arrange
      const useCasePayload = {
        userId: "user-13894",
        threadId: "thread-342348",
        content: "yakin, km lebih keren?",
      };
      const expectedPayload = {
        id: "comment-h09ahv089y1q20r89y",
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      };

      const mockThreadRepo = new ThreadRepository();
      mockThreadRepo.verifyThreadAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const mockCommentRepo = new CommentRepository();
      mockCommentRepo.addCommentToThread = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(new AddedComment(expectedPayload))
        );

      const threadUseCase = new CommentUseCase({
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
      });
      // action
      const addedComment = await threadUseCase.addNewCommentToThread(
        useCasePayload
      );
      // assert
      expect(addedComment.content).toEqual(expectedPayload.content);
      expect(addedComment.id).toEqual(expectedPayload.id);
      expect(addedComment.owner).toEqual(expectedPayload.owner);
      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepo.addCommentToThread).toBeCalledWith(useCasePayload);
    });
    it("should throw error when thread is not found", async () => {
      // arrange
      const useCasePayload = {
        userId: "user-13894",
        threadId: "thread-342348",
        content: "yakin, km lebih keren?",
      };
      const mockThreadRepo = new ThreadRepository();
      const mockCommentRepo = new CommentRepository();
      mockThreadRepo.verifyThreadAvaibility = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(
            new NotFoundError("thread tidak ditemukan di database")
          )
        );
      mockCommentRepo.addCommentToThread = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const threadUseCase = new CommentUseCase({
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
      });
      // action && assert
      await expect(
        threadUseCase.addNewCommentToThread(useCasePayload)
      ).rejects.toThrow(NotFoundError);

      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepo.addCommentToThread).toBeCalledTimes(0);
    });
  });
  describe("deleteComment", () => {
    it("should orchestrating deleting comment", async () => {
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
      mockCommentRepo.verifyCommentOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve(useCasePayload.userId));
      mockCommentRepo.deleteCommentById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
      });
      // action & assert
      await expect(
        commentUseCase.deleteComment(
          useCasePayload.threadId,
          useCasePayload.commentId,
          useCasePayload.userId
        )
      ).resolves.not.toThrow(Error);

      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepo.verifyCommentOwner).toBeCalledWith(
        useCasePayload.userId,
        useCasePayload.commentId
      );
      expect(mockCommentRepo.deleteCommentById).toBeCalledWith(
        useCasePayload.commentId
      );
    });
  });
});
