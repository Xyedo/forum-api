import { Pool } from "pg";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError";
import NotFoundError from "../../Commons/exceptions/NotFoundError";
import { ReplyEntity } from "../../Commons/types";
import AddedReply from "../../Domains/reply/entities/AddedReply";
import ReplyRepository from "../../Domains/reply/ReplyRepository";

export default class ReplyRepositoryPostgres extends ReplyRepository {
  private pool: Pool;

  private idGen: () => string;

  constructor(pool: Pool, idGen: () => string) {
    super();
    this.pool = pool;
    this.idGen = idGen;
  }

  async addReplyToComment({
    commentId,
    content,
    userId,
  }: ReplyEntity): Promise<AddedReply> {
    const replyId = `reply-${this.idGen()}`;
    const query = {
      text: `
      INSERT INTO reply(id,comment_id,user_id,content,date)
      VALUES($1,$2,$3,$4,$5)
      RETURNING id, content, user_id AS "owner"`,
      values: [replyId, commentId, userId, content, new Date()],
    };
    const result = await this.pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyOwner(userId: string, replyId: string): Promise<void> {
    const query = {
      text: `SELECT user_id as "owner" FROM reply WHERE id = $1`,
      values: [replyId],
    };
    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError("reply tidak ditemukan di database");
    }
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError("resource ini bukan untuk dirimu ysy");
    }
  }

  async deleteReplyById(replyId: string) {
    const query = {
      text: `UPDATE reply SET is_delete = TRUE WHERE id = $1 RETURNING id`,
      values: [replyId],
    };
    const res = await this.pool.query(query);
    if (res.rowCount === 0) {
      throw new NotFoundError("reply tidak ditemukan di database");
    }
  }
}
