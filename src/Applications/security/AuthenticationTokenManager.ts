/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { TokenPayload } from "../../Commons/types";

class AuthenticationTokenManager {
  async createRefreshToken(payload: TokenPayload): Promise<string> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async verifyRefreshToken(token: string) {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  async decodePayload(token: string): Promise<TokenPayload> {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }
}

export default AuthenticationTokenManager;
