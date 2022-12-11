import AddedDetailThread from "../AddedDetailThread";

describe("a AddedDetailThread entities", () => {
  it("should hidden the isDeleted true comment /replies", () => {
    // arrange
    const payload = {
      id: "thread-h_2FkLZhtgBKY2kh4CC02",
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
          likeCount: 5,
          isDelete: true,
          replies: [
            {
              id: "reply-yksuCoxM2s4MMrZJO-qVD",
              username: "dicoding",
              date: "2021-08-08T07:26:21.338Z",
              content: "reply 1",
              isDelete: true,
            },
            {
              id: "reply-yksuCoxM2s4MMrZJO-qsdD",
              username: "dicoding",
              date: "2021-08-08T07:26:21.338Z",
              content: "reply 2",
              isDelete: false,
            },
          ],
        },
        {
          id: "comment-yksuCoxM2s4MMrZJO-qVD",
          username: "dicoding",
          date: "2021-08-08T07:26:21.338Z",
          content: "comment dua",
          isDelete: false,
          likeCount: 4,
          replies: [],
        },
      ],
    };
    // action
    const { detailThread } = new AddedDetailThread(payload);
    // assert
    const { comments } = detailThread;
    expect(comments![0]).not.toHaveProperty("isDelete");
    expect(comments![1]).not.toHaveProperty("isDelete");
    expect(comments![0].content).toEqual("**komentar telah dihapus**");
    expect(comments![0].likeCount).toEqual(5);
    expect(comments![1].content).toEqual(payload.comments[1].content);
    const { replies } = comments![0];
    expect(replies![0]).not.toHaveProperty("isDelete");
    expect(replies![1]).not.toHaveProperty("isDelete");
    expect(replies![0].content).toEqual("**balasan telah dihapus**");
    expect(replies![1].content).toEqual(payload.comments[0].replies[1].content);
  });
});
