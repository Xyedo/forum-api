import AddedReply from "../../../Domains/reply/entities/AddedReply";
import CommentRepository from "../../../Domains/comment/CommentRepository";
import ReplyRepository from "../../../Domains/reply/ReplyRepository";
import ThreadRepository from "../../../Domains/thread/ThreadRepository";
import ReplyUseCase from "../ReplyUseCase";

describe("ReplyUseCase", () => {
  describe("AddNewReplyToComment", () => {
    it("should orchestrating addNewReplyToComment correctly", async () => {
      // arrange
      const mockThreadRepo = new ThreadRepository();
      const mockCommentRepo = new CommentRepository();
      const mockReplyRepo = new ReplyRepository();
      const useCasePayload = {
        userId: "user-123",
        threadId: "thread-123",
        commentId: "comment-123",
        content: "hehh kakk",
      };
      const expectedPayload = {
        id: "reply-123",
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      };
      mockThreadRepo.verifyThreadAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepo.verifyCommentAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepo.addReplyToComment = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(new AddedReply(expectedPayload))
        );
      const replyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
        replyRepository: mockReplyRepo,
      });
      // action
      const addedReply = await replyUseCase.addNewReplyToComment(
        useCasePayload
      );
      // assert
      expect(addedReply.content).toEqual(expectedPayload.content);
      expect(addedReply.id).toEqual(expectedPayload.id);
      expect(addedReply.owner).toEqual(expectedPayload.owner);
      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepo.verifyCommentAvaibility).toBeCalledWith(
        useCasePayload.commentId
      );
      expect(mockReplyRepo.addReplyToComment).toBeCalledWith({
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        userId: useCasePayload.userId,
      });
    });
  });
  describe("deleteReply", () => {
    it("should orchestrating deleteReply correctly", async () => {
      // arrange
      const useCasePayload = {
        threadId: "thread-194",
        commentId: "comment-123",
        userId: "user-123",
        replyId: "reply-123",
      };
      const mockThreadRepo = new ThreadRepository();
      const mockCommentRepo = new CommentRepository();
      const mockReplyRepo = new ReplyRepository();
      mockThreadRepo.verifyThreadAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepo.verifyCommentAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepo.verifyReplyOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve(useCasePayload.userId));
      mockReplyRepo.deleteReplyById = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      const replyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepo,
        commentRepository: mockCommentRepo,
        replyRepository: mockReplyRepo,
      });
      // action &assert
      await expect(
        replyUseCase.deleteReply(
          useCasePayload.threadId,
          useCasePayload.commentId,
          useCasePayload.userId,
          useCasePayload.replyId
        )
      ).resolves.not.toThrow(Error);

      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepo.verifyCommentAvaibility).toBeCalledWith(
        useCasePayload.commentId
      );
      expect(mockReplyRepo.verifyReplyOwner).toBeCalledWith(
        useCasePayload.userId,
        useCasePayload.replyId
      );
      expect(mockReplyRepo.deleteReplyById).toBeCalledWith(
        useCasePayload.replyId
      );
    });
  });
});
