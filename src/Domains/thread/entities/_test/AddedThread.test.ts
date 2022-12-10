import AddedThread from "../AddedThread";

describe("a AddedThread entities", () => {
  it("should throw error when payload didnt contain needed properties", () => {
    const payload = {
      id: "thread-123",
      title: "gatau kak",
    };
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPS"
    );
  });
  it("should throw error when payload didnt meet data type specs", () => {
    const payload = {
      id: "thread-123",
      title: "gatau kak",
      owner: 10934,
    };
    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_THE_REQS_DATA_TYPES"
    );
  });
  it("should get the expected object", () => {
    const expectedPayload = {
      id: "thread-123",
      title: "gatau kak",
      owner: "user-189204",
    };
    const { id, title, owner } = new AddedThread(expectedPayload);
    expect(id).toEqual(expectedPayload.id);
    expect(title).toEqual(expectedPayload.title);
    expect(owner).toEqual(expectedPayload.owner);
  });
});
