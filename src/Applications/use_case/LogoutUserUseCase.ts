import { RefreshPayload } from "../../Commons/types";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";

type Deps = {
  authenticationRepository: AuthenticationRepository;
};

class LogoutUserUseCase {
  private authenticationRepository: AuthenticationRepository;

  constructor({ authenticationRepository }: Deps) {
    this.authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload: RefreshPayload) {
    LogoutUserUseCase.validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }

  private static validatePayload(payload: RefreshPayload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    if (typeof refreshToken !== "string") {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

export default LogoutUserUseCase;
