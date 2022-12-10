/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
class PasswordHash {
  async hash(password: string): Promise<string> {
    throw new Error("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  }

  async comparePassword(plain: string, encrypted: string): Promise<void> {
    throw new Error("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED");
  }
}

export default PasswordHash;
