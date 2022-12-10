import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import ReplyRepository from "../ReplyRepositoryPostgres";
import pool from "../../database/postgres/pool";
import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AddedReply from "../../../Domains/reply/entities/AddedReply";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError";

describe("ReplyRepository postgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe("addReplyToComment function", () => {
    it("should persist in the the db", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});

      // action
      await replyRepo.addReplyToComment({
        commentId: "comment-984",
        content: "hehh kak",
        userId: "user-123",
      });
      // assert
      const res = await ThreadTableTestHelper.findReplyById("reply-984");
      expect(res).toHaveLength(1);
      expect(res[0].id).toEqual("reply-984");
      expect(res[0].content).toEqual("hehh kak");
    });
    it("should return the expected value", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      const payload = {
        commentId: "comment-984",
        content: "hehh kak",
        userId: "user-123",
      };
      // action
      const res = await replyRepo.addReplyToComment(payload);
      // assert
      expect(res).toStrictEqual(
        new AddedReply({
          id: "reply-984",
          content: payload.content,
          owner: payload.userId,
        })
      );
    });
  });
  describe("verifyReplyOwner function", () => {
    it(" should throw NotFoundError when reply is not found", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await expect(
        replyRepo.verifyReplyOwner("user-123", "reply-984")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw NotFoundError when reply is found", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      await ThreadTableTestHelper.addNewReply({});
      // action & assert
      await expect(
        replyRepo.verifyReplyOwner("user-123", "reply-984")
      ).resolves.not.toThrow(NotFoundError);
    });
    it("should throw AuthorizationError when invalid owner", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      await ThreadTableTestHelper.addNewReply({});
      // action & assert
      await expect(
        replyRepo.verifyReplyOwner("user-124", "reply-984")
      ).rejects.toThrow(AuthorizationError);
    });
    it("should not throw AuthorizationError when valid owner", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      await ThreadTableTestHelper.addNewReply({});
      // action & assert
      await expect(
        replyRepo.verifyReplyOwner("user-123", "reply-984")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
  describe("deleteReplyById function", () => {
    it("should not throw NotFoundError when valid", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await ThreadTableTestHelper.addNewComment({});
      await ThreadTableTestHelper.addNewReply({});
      // action && assert
      await expect(replyRepo.deleteReplyById("reply-984")).resolves.not.toThrow(
        NotFoundError
      );
      const resp = await ThreadTableTestHelper.findReplyById("reply-984");
      expect(resp).toHaveLength(1);
      expect(resp[0].is_delete).toEqual(true);
    });
    it("should throw NotFoundError when invalid replyId", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const replyRepo = new ReplyRepository(pool, fakeIdGenerator);

      // action && assert
      await expect(replyRepo.deleteReplyById("reply-984")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
