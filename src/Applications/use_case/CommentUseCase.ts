import NewComment from "../../Domains/comment/entities/NewComment";
import CommentRepository from "../../Domains/comment/CommentRepository";
import ThreadRepository from "../../Domains/thread/ThreadRepository";
import { Payload } from "../../Commons/types";

type Deps = {
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
};
export default class CommentUseCase {
  private threadRepo: ThreadRepository;

  private commentRepo: CommentRepository;

  constructor({ threadRepository, commentRepository }: Deps) {
    this.threadRepo = threadRepository;
    this.commentRepo = commentRepository;
  }

  async addNewCommentToThread(useCasePayload: Payload) {
    const validPayload = new NewComment(useCasePayload);
    await this.threadRepo.verifyThreadAvaibility(validPayload.threadId);
    return this.commentRepo.addCommentToThread(validPayload);
  }

  async deleteComment(threadId: string, commentId: string, userId: string) {
    await this.threadRepo.verifyThreadAvaibility(threadId);
    await this.commentRepo.verifyCommentOwner(userId, commentId);
    await this.commentRepo.deleteCommentById(commentId);
  }
}
