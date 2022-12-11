/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool";

const CommentLikeTestHelper = {
  async findCommentLikeByCommentId(commentId: string) {
    const query = {
      text: `SELECT * FROM comment_like WHERE comment_id = $1`,
      values: [commentId],
    };
    const res = await pool.query(query);
    return res.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_like WHERE 1=1");
  },
};

export default CommentLikeTestHelper;
