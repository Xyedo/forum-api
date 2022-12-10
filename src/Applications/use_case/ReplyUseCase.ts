import NewReply from "../../Domains/reply/entities/NewReply";
import { Payload } from "../../Commons/types";
import CommentRepository from "../../Domains/comment/CommentRepository";
import ReplyRepository from "../../Domains/reply/ReplyRepository";
import ThreadRepository from "../../Domains/thread/ThreadRepository";

type Deps = {
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  replyRepository: ReplyRepository;
};
export default class ReplyUseCase {
  private threadRepo: ThreadRepository;

  private commentRepo: CommentRepository;

  private replyRepo: ReplyRepository;

  constructor({ commentRepository, replyRepository, threadRepository }: Deps) {
    this.commentRepo = commentRepository;
    this.replyRepo = replyRepository;
    this.threadRepo = threadRepository;
  }

  async addNewReplyToComment(payload: Payload) {
    const { commentId, content, threadId, userId } = new NewReply(payload);
    await this.threadRepo.verifyThreadAvaibility(threadId);
    await this.commentRepo.verifyCommentAvaibility(commentId);
    return this.replyRepo.addReplyToComment({
      commentId,
      content,
      userId,
    });
  }

  async deleteReply(
    threadId: string,
    commentId: string,
    userId: string,
    replyId: string
  ) {
    await this.threadRepo.verifyThreadAvaibility(threadId);
    await this.commentRepo.verifyCommentAvaibility(commentId);
    await this.replyRepo.verifyReplyOwner(userId, replyId);
    await this.replyRepo.deleteReplyById(replyId);
  }
}
