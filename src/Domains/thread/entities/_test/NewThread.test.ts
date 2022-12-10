import randomString from "../../../../../tests/TestHelper";
import NewThread from "../NewThread";

describe("a NewThread entities", () => {
  it("should throw error when payload didnt contain needede propeties", () => {
    const payload = {
      title: "test-123",
    };

    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload didnt contain needed props 2", () => {
    const payload = {
      userId: "user-90ahf",
      body: "test-123",
    };
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type spec", () => {
    const payload = {
      userId: "user-290u",
      title: 123,
      body: [],
    };
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.INVALID_TYPE"
    );
  });
  it("should throw error when title is longer than 128", () => {
    const payload = {
      userId: "user-190asd",
      title: randomString(200),
      body: "how to add new cooler system in my coolest room guys",
    };
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.MAX_LENGTH_OF_TITLE_IS_128"
    );
  });
  it("should create NewThread object correctly", () => {
    const payload = {
      userId: "user-190asd",
      title: "cool-cool-cool",
      body: "how to add new cooler system in my coolest room guys",
    };
    const { userId, title, body } = new NewThread(payload);
    expect(userId).toStrictEqual(payload.userId);
    expect(title).toStrictEqual(payload.title);
    expect(body).toStrictEqual(payload.body);
  });
});
