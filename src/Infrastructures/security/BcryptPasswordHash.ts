import bcrypt from "bcrypt";
import EncryptionHelper from "../../Applications/security/PasswordHash";
import AuthenticationError from "../../Commons/exceptions/AuthenticationError";

class BcryptPasswordHash extends EncryptionHelper {
  private bcrypt: typeof bcrypt;

  private saltRound: number;

  constructor(hashhelper: typeof bcrypt, saltRound = 10) {
    super();
    this.bcrypt = hashhelper;
    this.saltRound = saltRound;
  }

  async hash(password: string) {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<void> {
    const result = await this.bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError("kredensial yang Anda masukkan salah");
    }
  }
}

export default BcryptPasswordHash;
