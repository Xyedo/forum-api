import { Pool } from "pg";
import CommentLikeRepository from "../../Domains/comment-likes/CommentLikeRepository";

export default class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  async toogleLike(userId: string, commentId: string): Promise<void> {
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
    await this.pool.query(query);
  }
}
