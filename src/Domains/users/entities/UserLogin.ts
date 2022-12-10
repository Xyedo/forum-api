type Payload = {
  username: string;
  password: string;
};
class UserLogin {
  username: string;

  password: string;

  constructor(payload: Payload) {
    UserLogin.verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  private static verifyPayload(payload: Payload) {
    const { username, password } = payload;

    if (!username || !password) {
      throw new Error("USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof username !== "string" || typeof password !== "string") {
      throw new Error("USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

export default UserLogin;
