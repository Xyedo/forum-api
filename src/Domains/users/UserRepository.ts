/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import RegisterUser from "./entities/RegisterUser";
import RegisteredUser from "./entities/RegisteredUser";

class UserRepository {
  async addUser(registerUser: RegisterUser):Promise<RegisteredUser> {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyAvailableUsername(username: string) {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getPasswordByUsername(username: string): Promise<string> {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getIdByUsername(username: string): Promise<string> {
    throw new Error("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

export default UserRepository;
