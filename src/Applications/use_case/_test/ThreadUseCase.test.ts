import AddedThread from "../../../Domains/thread/entities/AddedThread";
import AddedDetailThread from "../../../Domains/thread/entities/AddedDetailThread";
import ThreadRepository from "../../../Domains/thread/ThreadRepository";
import ThreadUseCase from "../ThreadUseCase";

describe("ThreadUseCase", () => {
  describe("AddNewThread", () => {
    it("should orchestrating add new thread action correctly", async () => {
      // arange
      const userId = "user-apivh09ahva0ac";
      const useCasePayload = {
        title: "aku keren banget",
        body: "yakin, km lebih keren?",
      };
      const expectedPayload = {
        id: "thread_h09ahv089y1q20r89y",
        title: useCasePayload.title,
        owner: userId,
      };
      const mockThreadRepo = new ThreadRepository();

      mockThreadRepo.addNewThread = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(new AddedThread(expectedPayload))
        );

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepo,
      });
      // action
      const addedThread = await threadUseCase.addNewThread(
        userId,
        useCasePayload
      );
      // assert
      expect(addedThread.id).toEqual(expectedPayload.id);
      expect(addedThread.owner).toEqual(expectedPayload.owner);
      expect(addedThread.title).toEqual(expectedPayload.title);
      expect(mockThreadRepo.addNewThread).toBeCalledWith({
        userId,
        title: useCasePayload.title,
        body: useCasePayload.body,
      });
    });
  });

  describe("getDetailThread", () => {
    it("should orchestrating detailThread useCase", async () => {
      // arrange
      const threadId = "thread-123";
      const payload = new AddedDetailThread({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
        comments: [
          {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            content: "sebuah comment",
            isDelete: true,
          },
          {
            id: "comment-yksuCoxM2s4MMrZJO-qVD",
            username: "dicoding",
            date: "2021-08-08T07:26:21.338Z",
            content: "sebuah comment yg tidak dihapus",
            isDelete: false,
          },
        ],
      });
      const expectedPayload = { ...payload.detailThread };
      const mockThreadRepo = new ThreadRepository();
      mockThreadRepo.verifyThreadAvaibility = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockThreadRepo.getThreadDetailById = jest
        .fn()
        .mockImplementation(() => payload);
      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepo,
      });
      // action
      const res = await threadUseCase.getDetailThread(threadId);
      // assert
      expect(res).toStrictEqual(expectedPayload);
      expect(mockThreadRepo.verifyThreadAvaibility).toBeCalledWith(threadId);
      expect(mockThreadRepo.getThreadDetailById).toBeCalledWith(threadId);
    });
  });
});
