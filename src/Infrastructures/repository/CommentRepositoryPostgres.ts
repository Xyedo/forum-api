import { Pool } from "pg";
import { ThreadComment } from "../../Commons/types";
import AddedComment from "../../Domains/comment/entities/AddedComment";
import CommentRepository from "../../Domains/comment/CommentRepository";
import NotFoundError from "../../Commons/exceptions/NotFoundError";
import AuthorizationError from "../../Commons/exceptions/AuthorizationError";

export default class CommentRepositoryPostgres extends CommentRepository {
  private pool: Pool;

  private idGen: () => string;

  constructor(pool: Pool, idGen: () => string) {
    super();
    this.pool = pool;
    this.idGen = idGen;
  }

  async addCommentToThread({
    userId,
    threadId,
    content,
  }: ThreadComment): Promise<AddedComment> {
    const id = `comment-${this.idGen()}`;
    const query = {
      text: `INSERT INTO
        comment(id, thread_id,user_id, content, "date")
        VALUES($1,$2,$3,$4,$5)
        RETURNING id,content, user_id AS "owner"`,
      values: [id, threadId, userId, content, new Date()],
    };

    const result = await this.pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteCommentById(id: string) {
    const query = {
      text: `UPDATE comment SET is_delete = TRUE WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const res = await this.pool.query(query);
    if (res.rowCount === 0) {
      throw new NotFoundError("comment tidak ditemukan di database");
    }
  }

  async verifyCommentAvaibility(commentId: string): Promise<void> {
    const res = await this.getCommentById(commentId);
    if (res.rowCount === 0) {
      throw new NotFoundError("comment tidak ditemukan di database");
    }
  }

  async verifyCommentOwner(userId: string, commentId: string): Promise<void> {
    const res = await this.getCommentById(commentId);
    if (res.rowCount === 0) {
      throw new NotFoundError("comment tidak ditemukan di database");
    }
    if (res.rows[0].owner !== userId) {
      throw new AuthorizationError("resource ini bukan untuk dirimu ysy");
    }
  }

  private async getCommentById(commentId: string) {
    const query = {
      text: `SELECT id, content, user_id as "owner" FROM comment WHERE id = $1`,
      values: [commentId],
    };
    return this.pool.query(query);
  }
}
