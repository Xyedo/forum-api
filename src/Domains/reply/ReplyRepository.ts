/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { ReplyEntity } from "../../Commons/types";
import AddedReply from "./entities/AddedReply";

export default class ReplyRepository {
  async addReplyToComment({
    commentId,
    content,
    userId,
  }: ReplyEntity): Promise<AddedReply> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyReplyOwner(userId:string, replyId: string): Promise<void> {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReplyById(replyId: string) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}
