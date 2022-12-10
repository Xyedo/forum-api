type Payload = {
  accessToken: string;
  refreshToken: string;
};
class NewAuth {
  public accessToken: string;

  public refreshToken: string;

  constructor(payload: Payload) {
    NewAuth.verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  private static verifyPayload(payload: Payload) {
    const { accessToken, refreshToken } = payload;

    if (!accessToken || !refreshToken) {
      throw new Error("NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
      throw new Error("NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

export default NewAuth;
