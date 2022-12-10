import * as Jwt from "@hapi/jwt";
import AuthenticationTokenManager from "../../Applications/security/AuthenticationTokenManager";
import InvariantError from "../../Commons/exceptions/InvariantError";
import { TokenPayload } from "../../Commons/types";

class JwtTokenManager extends AuthenticationTokenManager {
  private jwt: typeof Jwt.token;

  constructor(jwt: typeof Jwt.token) {
    super();
    this.jwt = jwt;
  }

  async createAccessToken(payload: TokenPayload) {
    return this.jwt.generate(payload, process.env.ACCESS_TOKEN_KEY as string);
  }

  async createRefreshToken(payload: TokenPayload) {
    return this.jwt.generate(payload, process.env.REFRESH_TOKEN_KEY as string);
  }

  async verifyRefreshToken(token: string) {
    try {
      const artifacts = this.jwt.decode(token);
      this.jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY as string);
    } catch (error) {
      throw new InvariantError("refresh token tidak valid");
    }
  }

  async decodePayload(token: string): Promise<TokenPayload> {
    const artifacts = this.jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

export default JwtTokenManager;
