import { Pool } from "pg";
import InvariantError from "../../Commons/exceptions/InvariantError";
import RegisteredUser from "../../Domains/users/entities/RegisteredUser";
import UserRepository from "../../Domains/users/UserRepository";
import RegisterUser from "../../Domains/users/entities/RegisterUser";

class UserRepositoryPostgres extends UserRepository {
  private pool: Pool;

  private idGenerator: () => string;

  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username: string) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("username tidak tersedia");
    }
  }

  async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.idGenerator()}`;

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
      values: [id, username, password, fullname],
    };

    const result = await this.pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username: string):Promise<string> {
    const query = {
      text: "SELECT password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("username tidak ditemukan");
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username:string):Promise<string> {
    const query = {
      text: "SELECT id FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("user tidak ditemukan");
    }

    const { id } = result.rows[0];

    return id;
  }
}

export default UserRepositoryPostgres;
