import { Pool } from "pg";
import { Thread } from "../../Commons/types";
import AddedThread from "../../Domains/thread/entities/AddedThread";
import ThreadRepository from "../../Domains/thread/ThreadRepository";
import NotFoundError from "../../Commons/exceptions/NotFoundError";
import AddedDetailThread from "../../Domains/thread/entities/AddedDetailThread";

class ThreadRepositoryPostgres extends ThreadRepository {
  private pool: Pool;

  private idGen: () => string;

  constructor(pool: Pool, idGen: () => string) {
    super();
    this.pool = pool;
    this.idGen = idGen;
  }

  async addNewThread(newThread: Thread): Promise<AddedThread> {
    const { userId, title, body } = newThread;
    const id = `thread-${this.idGen()}`;
    const query = {
      text: `INSERT INTO 
        thread(id, title, body, user_id, "date") 
        VALUES($1,$2,$3,$4,$5) 
        RETURNING id, title, user_id AS "owner"`,
      values: [id, title, body, userId, new Date()],
    };

    const result = await this.pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadAvaibility(threadId: string): Promise<void> {
    const query = {
      text: `SELECT id FROM thread WHERE id = $1`,
      values: [threadId],
    };
    const result = await this.pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError("thread tidak ditemukan di database");
    }
  }

  async getThreadDetailById(id: string): Promise<AddedDetailThread> {
    const query = {
      text: `
      SELECT 
        t.id, 
        t.title,
        t.body,
        t.date,
        u.username,
        ( 
          SELECT json_agg(comment)
          FROM (
            SELECT               
              c.id,
              c.content,
              (
                SELECT COUNT(likes)
                FROM comment_like
                WHERE 
                  comment_id = c.id AND
                  likes = TRUE
              ) AS "likeCount",
              c.is_delete AS "isDelete",
              c.date,
              u1.username,
              (
                SELECT json_agg(reply)
                FROM (
                  SELECT
                    r.id,
                    r.content,
                    r.is_delete AS "isDelete",
                    r.date,
                    u2.username
                  FROM reply r
                  JOIN users u2
                    ON u2.id = r.user_id
                  WHERE c.id = r.comment_id
                  ORDER BY r.date ASC
                ) reply
              ) as replies
              FROM comment c
              JOIN users u1
                ON u1.id = c.user_id
              WHERE c.thread_id = t.id
              ORDER BY c.date ASC
          ) comment
        ) as comments
      FROM thread t
      JOIN users u
        ON u.id = t.user_id
      WHERE t.id = $1
      `,
      values: [id],
    };
    const res = await this.pool.query(query);
    if (res.rowCount === 0) {
      throw new NotFoundError("thread tidak ditemukan didatabase");
    }
    return new AddedDetailThread(res.rows[0]);
  }
}

export default ThreadRepositoryPostgres;
