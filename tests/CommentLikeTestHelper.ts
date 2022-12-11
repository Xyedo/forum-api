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
  async toogleLikes(commentId: string, userId: string) {
    const likeId = `${commentId}-${userId}`;
    const query = {
      text: `WITH new_values(id,comment_id,user_id) AS (
        VALUES($1,$2,$3)
      ),
      UPSERT AS (
        UPDATE comment_like cl
          SET likes = NOT likes
        FROM new_values nv
        WHERE cl.id = nv.id
        RETURNING cl.* 
      )
      INSERT INTO comment_like(id,comment_id, user_id, likes)
      SELECT id, comment_id,user_id, TRUE
      FROM new_values
      WHERE NOT EXISTS (
        SELECT 1
        FROM upsert up
        WHERE up.id = new_values.id
      )`,
      values: [likeId, commentId, userId],
    };
    await pool.query(query);
  },
  async cleanTable() {
    await pool.query("DELETE FROM comment_like WHERE 1=1");
  },
};

export default CommentLikeTestHelper;
