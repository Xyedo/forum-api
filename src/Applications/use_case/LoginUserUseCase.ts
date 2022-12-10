import UserLogin from "../../Domains/users/entities/UserLogin";
import NewAuthentication from "../../Domains/authentications/entities/NewAuth";
import UserRepository from "../../Domains/users/UserRepository";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import AuthenticationTokenManager from "../security/AuthenticationTokenManager";
import PasswordHash from "../security/PasswordHash";

type Deps = {
  userRepository: UserRepository;
  authenticationRepository: AuthenticationRepository;
  authenticationTokenManager: AuthenticationTokenManager;
  passwordHash: PasswordHash;
};
type LoginPayload = {
  username: string;
  password: string;
};
class LoginUserUseCase {
  userRepository: UserRepository;

  authenticationRepository: AuthenticationRepository;

  authenticationTokenManager: AuthenticationTokenManager;

  passwordHash: PasswordHash;

  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: Deps) {
    this.userRepository = userRepository;
    this.authenticationRepository = authenticationRepository;
    this.authenticationTokenManager = authenticationTokenManager;
    this.passwordHash = passwordHash;
  }

  async execute(useCasePayload: LoginPayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this.userRepository.getPasswordByUsername(
      username
    );

    await this.passwordHash.comparePassword(password, encryptedPassword);

    const id = await this.userRepository.getIdByUsername(username);

    const accessToken = await this.authenticationTokenManager.createAccessToken(
      {
        username,
        id,
      }
    );
    const refreshToken =
      await this.authenticationTokenManager.createRefreshToken({
        username,
        id,
      });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this.authenticationRepository.addToken(
      newAuthentication.refreshToken
    );

    return newAuthentication;
  }
}

export default LoginUserUseCase;
