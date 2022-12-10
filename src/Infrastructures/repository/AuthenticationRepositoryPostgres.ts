import InvariantError from "../../Commons/exceptions/InvariantError";
import AuthenticationRepository from "../../Domains/authentications/AuthenticationRepository";
import Pool from "../database/postgres/pool";

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  private pool: typeof Pool;

  constructor(pool: typeof Pool) {
    super();
    this.pool = pool;
  }

  async addToken(token: string) {
    const query = {
      text: "INSERT INTO authentications VALUES ($1)",
      values: [token],
    };

    await this.pool.query(query);
  }

  async checkAvailabilityToken(token: string) {
    const query = {
      text: "SELECT * FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError("refresh token tidak ditemukan di database");
    }
  }

  async deleteToken(token: string) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this.pool.query(query);
  }
}

export default AuthenticationRepositoryPostgres;
