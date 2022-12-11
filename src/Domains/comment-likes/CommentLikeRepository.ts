/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
export default class CommentLikeRepository {

  async toogleLike(userId:string, commentId:string):Promise<void> {
    throw new Error("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  }
}