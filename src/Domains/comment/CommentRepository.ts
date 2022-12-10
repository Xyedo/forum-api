/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { ThreadComment } from "../../Commons/types";
import AddedComment from "./entities/AddedComment";

export default class CommentRepository {
  async addCommentToThread({
    userId,
    threadId,
    content,
  }: ThreadComment): Promise<AddedComment> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteCommentById(id: string) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentAvaibility(commentId:string):Promise<void> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyCommentOwner(userId: string, commentId: string): Promise<void> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}
