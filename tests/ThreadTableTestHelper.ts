/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool";

const ThreadTableTestHelper = {
  async addNewThread({
    id = "thread-123",
    title = "yakin kah maniez",
    body = "jangan bohong maniez",
    userId = "user-123",
    date = new Date()
  }) {
    const query = {
      text: `INSERT INTO thread(id, title, body, user_id, date) VALUES($1,$2,$3,$4,$5)`,
      values: [id, title, body, userId, date],
    };
    await pool.query(query);
  },
  async addNewComment({
    id = "comment-984",
    threadId = "thread-123",
    userId = "user-123",
    content = "rilmint1",
    date = new Date()
  }) {
    const query = {
      text: `INSERT INTO comment(id,thread_id,user_id,content,date) VALUES($1,$2,$3,$4, $5)`,
      values: [id, threadId, userId, content, date],
    };
    await pool.query(query);
  },
  async addNewReply({
    id = "reply-984",
    commentId = "comment-984",
    userId = "user-123",
    content = "rilmint2",
    date = new Date()
  }) {
    const query = {
      text: `INSERT INTO reply(id, comment_id, user_id, content, date) VALUES($1,$2,$3,$4,$5)`,
      values: [id, commentId, userId, content, date],
    };
    await pool.query(query);
  },
  async findCommentById(id: string) {
    const query = {
      text: `SELECT id, content, user_id AS owner, is_delete FROM comment WHERE id = $1`,
      values: [id],
    };
    const res = await pool.query(query);
    return res.rows;
  },
  async findThreadById(id: string) {
    const query = {
      text: "SELECT id, title, user_id AS owner FROM thread WHERE id= $1",
      values: [id],
    };
    const res = await pool.query(query);
    return res.rows;
  },
  async findReplyById(id: string) {
    const query = {
      text: `SELECT id, content, user_id AS owner, is_delete FROM reply WHERE id = $1`,
      values: [id],
    };
    const res = await pool.query(query);
    return res.rows;
  },
  async cleanTable() {
    await pool.query("DELETE FROM thread WHERE 1=1");
    await pool.query("DELETE FROM comment WHERE 1=1");
    await pool.query("DELETE FROM reply WHERE 1=1");
  },
};

export default ThreadTableTestHelper;
