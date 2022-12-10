import CommentRepositoryPostgres from "../CommentRepositoryPostgres";
import AddedComment from "../../../Domains/comment/entities/AddedComment";
import NewComment from "../../../Domains/comment/entities/NewComment";

import pool from "../../database/postgres/pool";
import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError";

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe("addCommentToThread function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
    });
    it("should presist new thread and return", async () => {
      const newComment = new NewComment({
        userId: "user-123",
        threadId: "thread-123",
        content: "hai smuanya",
      });
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepository.addCommentToThread(newComment);
      const resp = await ThreadTableTestHelper.findCommentById("comment-123");
      expect(resp).toHaveLength(1);
      expect(resp[0].id).toEqual("comment-123");
      expect(resp[0].owner).toEqual("user-123");
    });
    it("it should return addedComment correctly", async () => {
      const newComment = new NewComment({
        userId: "user-123",
        threadId: "thread-123",
        content: "hai smuanya",
      });
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const res = await commentRepository.addCommentToThread(newComment);
      expect(res).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: newComment.content,
          owner: newComment.userId,
        })
      );
    });
  });
  describe("verifyCommentAvaibility function", () => {
    it("should throw NotFoundError when comment is not found", async () => {
      // arrange
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // action and assert
      await expect(
        commentRepository.verifyCommentAvaibility("9a0uda")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw NotFoundError when thread is found", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      await expect(
        commentRepository.verifyCommentAvaibility("comment-984")
      ).resolves.not.toThrow(NotFoundError);
    });
  });
  describe("verifyCommentOwner function", () => {
    it("should throw NotFoundError when comment is not found", async () => {
      // arrange
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // action and assert
      await expect(
        commentRepository.verifyCommentOwner("user-123", "9a0uda")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw NotFoundError when thread is found", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      await expect(
        commentRepository.verifyCommentOwner("user-123", "comment-984")
      ).resolves.not.toThrow(NotFoundError);
    });
    it("should throw authorizationError when invalid owner", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      // action and assert
      await expect(
        commentRepository.verifyCommentOwner("user-124", "comment-984")
      ).rejects.toThrow(AuthorizationError);
    });
    it("should not throw authorizationError when valid owner", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      // action and assert
      await expect(
        commentRepository.verifyCommentOwner("user-123", "comment-984")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
  describe("DeleteCommentById function", () => {
    it("should not to throw NotFoundError when deleting valid comment", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      // action && assert
      await expect(
        commentRepository.deleteCommentById("comment-984")
      ).resolves.not.toThrow(NotFoundError);

      const resp = await ThreadTableTestHelper.findCommentById("comment-984");
      expect(resp).toHaveLength(1);
      expect(resp[0].is_delete).toEqual(true);
    });
    it("should to throw NotFoundError when deleting invalid comment", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // action
      await expect(
        commentRepository.deleteCommentById("comment-984")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
