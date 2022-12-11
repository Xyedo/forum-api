import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import AddedThread from "../../../Domains/thread/entities/AddedThread";
import NewThread from "../../../Domains/thread/entities/NewThread";
import pool from "../../database/postgres/pool";
import ThreadRepository from "../ThreadRepositoryPostgres";
import NotFoundError from "../../../Commons/exceptions/NotFoundError";
import CommentLikeTestHelper from "../../../../tests/CommentLikeTestHelper";

describe("ThreadRepository postgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentLikeTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("addNewThread function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({});
    });
    it("should presist new thread and return ", async () => {
      const newThread = new NewThread({
        userId: "user-123",
        title: "gatau",
        body: "makin gatau sumpah",
      });
      const fakeIdGenerator = () => "123";
      const threadRepository = new ThreadRepository(pool, fakeIdGenerator);

      await threadRepository.addNewThread(newThread);

      const resp = await ThreadTableTestHelper.findThreadById("thread-123");
      expect(resp).toHaveLength(1);
      expect(resp[0].id).toEqual("thread-123");
      expect(resp[0].title).toEqual("gatau");
      expect(resp[0].owner).toEqual("user-123");
    });
    it("should return addedThread correctly", async () => {
      const newThread = new NewThread({
        userId: "user-123",
        title: "gatau",
        body: "makin gatau sumpah",
      });
      const fakeIdGenerator = () => "123";
      const threadRepository = new ThreadRepository(pool, fakeIdGenerator);

      const resp = await threadRepository.addNewThread(newThread);
      expect(resp).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: newThread.title,
          owner: newThread.userId,
        })
      );
    });
  });

  describe("findThreadById function", () => {
    it("should throw NotFoundError when thread is not found", async () => {
      // arrange
      const fakeIdGenerator = () => "123";
      const threadRepository = new ThreadRepository(pool, fakeIdGenerator);
      // action and assert
      await expect(
        threadRepository.verifyThreadAvaibility("9a0uda")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw NotFoundError when thread is found", async () => {
      // arrange
      const fakeIdGenerator = () => "123";
      const threadRepository = new ThreadRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addNewThread({});
      await expect(
        threadRepository.verifyThreadAvaibility("thread-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getThreadDetailById function", () => {
    it("should back with expected value", async () => {
      // arrange
      const fakeIdGenerator = () => "984";
      const threadRepository = new ThreadRepository(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: "user-123" });
      const expectedThread = {
        id: "thread-123",
        userId: "user-123",
        body: "jangn boonk km yah",
        title: "sbenernya dunia ini udh runtuh kak",
        date: new Date(),
      };
      await ThreadTableTestHelper.addNewThread(expectedThread);
      const expectedComment1 = {
        id: "comment-123",
        threadId: "thread-123",
        content: "this comment first",
        userId: "user-123",
        date: new Date(),
      };
      await ThreadTableTestHelper.addNewComment(expectedComment1);
      await CommentLikeTestHelper.toogleLikes(
        expectedComment1.id,
        expectedComment1.userId
      );
      await UsersTableTestHelper.addUser({ id: "user-124", username: "xyedo" });
      await CommentLikeTestHelper.toogleLikes(expectedComment1.id, "user-124");
      const expectedComment2 = {
        id: "comment-321",
        threadId: "thread-123",
        userId: "user-123",
        content: "this comment second",
        date: new Date(),
      };
      await ThreadTableTestHelper.addNewComment(expectedComment2);
      const expectedReply1 = {
        commentId: "comment-123",
        id: "reply-123",
        content: "this reply first",
        userId: "user-123",
        date: new Date(),
      };
      await ThreadTableTestHelper.addNewReply(expectedReply1);
      const expectedReply2 = {
        commentId: "comment-123",
        id: "reply-321",
        content: "this reply second",
        userId: "user-123",
        date: new Date(),
      };
      await ThreadTableTestHelper.addNewReply(expectedReply2);

      // action
      const { detailThread } = await threadRepository.getThreadDetailById(
        "thread-123"
      );
      // assert
      expect(detailThread).toBeDefined();
      expect(detailThread.id).toEqual(expectedThread.id);
      expect(detailThread.title).toEqual(expectedThread.title);
      expect(detailThread.body).toEqual(expectedThread.body);
      expect(new Date(detailThread.date)).toEqual(expectedThread.date);

      let res = await UsersTableTestHelper.findUsersById(expectedThread.userId);
      expect(detailThread.username).toEqual(res[0].username);

      expect(detailThread.comments).toHaveLength(2);

      const [comment1, comment2] = detailThread.comments!!;

      expect(comment1.id).toEqual(expectedComment1.id);

      res = await UsersTableTestHelper.findUsersById(expectedComment1.userId);
      expect(comment1.username).toEqual(res[0].username);
      expect(new Date(comment1.date)).toEqual(expectedComment1.date);
      expect(comment1.content).toEqual(expectedComment1.content);
      expect(comment1.likeCount).toEqual(2);
      expect(comment1).not.toHaveProperty("isDelete");

      expect(comment2.id).toEqual(expectedComment2.id);

      res = await UsersTableTestHelper.findUsersById(expectedComment2.userId);
      expect(comment2.username).toEqual(res[0].username);
      expect(new Date(comment2.date)).toEqual(expectedComment2.date);
      expect(comment2.content).toEqual(expectedComment2.content);
      expect(comment2.likeCount).toEqual(0);
      expect(comment2).not.toHaveProperty("isDelete");

      expect(comment1.replies).toHaveLength(2);

      const [reply1, reply2] = comment1.replies!!;
      expect(reply1.id).toEqual(expectedReply1.id);
      expect(reply1.content).toEqual(expectedReply1.content);
      expect(new Date(reply1.date)).toEqual(expectedReply1.date);

      res = await UsersTableTestHelper.findUsersById(expectedReply1.userId);

      expect(reply1.username).toEqual(res[0].username);

      expect(reply1).not.toHaveProperty("isDelete");

      expect(reply2.id).toEqual(expectedReply2.id);
      expect(reply2.content).toEqual(expectedReply2.content);
      expect(new Date(reply2.date)).toEqual(expectedReply2.date);

      res = await UsersTableTestHelper.findUsersById(expectedReply2.userId);

      expect(reply2.username).toEqual(res[0].username);

      expect(reply2).not.toHaveProperty("isDelete");
    });
    it("should throw error when invalid threadId", async () => {
      const fakeIdGenerator = () => "984";
      const threadRepository = new ThreadRepository(pool, fakeIdGenerator);
      await expect(
        threadRepository.getThreadDetailById("thread-123")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
