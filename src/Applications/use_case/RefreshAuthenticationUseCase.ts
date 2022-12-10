import { RefreshPayload } from "../../Commons/types";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import AuthenticationTokenManager from "../security/AuthenticationTokenManager";

type Deps = {
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
};

class RefreshAuthenticationUseCase {
  private authenticationRepository: AuthenticationRepository;

  private authenticationTokenManager: AuthenticationTokenManager;

  constructor({ authenticationRepository, authenticationTokenManager }: Deps) {
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload: RefreshPayload) {
    RefreshAuthenticationUseCase.verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id } =
      await this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, id });
  }

  private static verifyPayload(payload: RefreshPayload) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    if (typeof refreshToken !== "string") {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

export default RefreshAuthenticationUseCase;
