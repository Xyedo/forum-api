import CommentLikeTestHelper from "../../../../tests/CommentLikeTestHelper";
import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AddCommentLikes from "../../../Domains/comment-likes/entities/NewCommentLikes";
import pool from "../../database/postgres/pool";
import CommentLikeRepository from "../CommentLikeRepositoryPostgres";

describe("CommentLikeRepository postgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe("toogleLikeComment function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
    });
    afterEach(async () => {
      await CommentLikeTestHelper.cleanTable();
    });
    it("should presist new commentLike and likes true", async () => {
      // arrange
      const newCommentLike = new AddCommentLikes({
        commentId: "comment-984",
        threadId: "thread-123",
        userId: "user-123",
      });
      const commentLikeRepo = new CommentLikeRepository(pool);
      // action & assert
      await expect(
        commentLikeRepo.toogleLike(
          newCommentLike.userId,
          newCommentLike.commentId
        )
      ).resolves.not.toThrow(Error);
      const res = await CommentLikeTestHelper.findCommentLikeByCommentId(
        newCommentLike.commentId
      );
      expect(res).toHaveLength(1);
      expect(res[0].likes).toEqual(true)
    });
    it("should presis new commentLike and likes true then false", async () => {
      // arrange
      const newCommentLike = new AddCommentLikes({
        commentId: "comment-984",
        threadId: "thread-123",
        userId: "user-123",
      });
      const commentLikeRepo = new CommentLikeRepository(pool);
      // action & assert
      await expect(
        commentLikeRepo.toogleLike(
          newCommentLike.userId,
          newCommentLike.commentId
        )
      ).resolves.not.toThrow(Error);
      const res1 = await CommentLikeTestHelper.findCommentLikeByCommentId(
        newCommentLike.commentId
      );
      expect(res1).toHaveLength(1);
      expect(res1[0].likes).toEqual(true)
      await expect(
        commentLikeRepo.toogleLike(
          newCommentLike.userId,
          newCommentLike.commentId
        )
      ).resolves.not.toThrow(Error);
      const res = await CommentLikeTestHelper.findCommentLikeByCommentId(
        newCommentLike.commentId
      );
      expect(res).toHaveLength(1);
      expect(res[0].likes).toEqual(false)
    })
  });
});
