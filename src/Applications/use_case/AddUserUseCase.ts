import UserRepository from "../../Domains/users/UserRepository";
import PasswordHash from "../security/PasswordHash";

import RegisterUser from "../../Domains/users/entities/RegisterUser";

type Deps = {
  userRepository: UserRepository;
  passwordHash: PasswordHash;
};
type NewUser = {
  username: string;
  password: string;
  fullname: string;
};
class AddUserUseCase {
  private userRepository: UserRepository;

  private passwordHash: PasswordHash;

  constructor({ userRepository, passwordHash }: Deps) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
  }

  async execute(useCasePayload: NewUser) {
    const registerUser = new RegisterUser(useCasePayload);
    await this.userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this.passwordHash.hash(registerUser.password);
    return this.userRepository.addUser(registerUser);
  }
}

export default AddUserUseCase;
