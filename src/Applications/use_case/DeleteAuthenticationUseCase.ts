import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";

type Deps = {
  authenticationRepository: AuthenticationRepository;
};
type Payload = {
  refreshToken: string;
};
class DeleteAuthenticationUseCase {
  private authenticationRepo: AuthenticationRepository;

  constructor({ authenticationRepository }: Deps) {
    this.authenticationRepo = authenticationRepository;
  }

  async execute(useCasePayload: Payload) {
    DeleteAuthenticationUseCase.validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this.authenticationRepo.checkAvailabilityToken(refreshToken);
    await this.authenticationRepo.deleteToken(refreshToken);
  }

  private static validatePayload(payload: Payload) {
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

export default DeleteAuthenticationUseCase;
