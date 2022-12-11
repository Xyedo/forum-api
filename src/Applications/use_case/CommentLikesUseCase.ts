import { Payload } from "../../Commons/types";
import CommentLikeRepository from "../../Domains/comment-likes/CommentLikeRepository";
import CommentRepository from "../../Domains/comment/CommentRepository";
import ThreadRepository from "../../Domains/thread/ThreadRepository";
import NewCommentLikes from "../../Domains/comment-likes/entities/NewCommentLikes";

type Deps = {
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  commentLikeRepository: CommentLikeRepository;
};
export default class CommentLikesUseCase {
  private threadRepo: ThreadRepository;

  private commentRepo: CommentRepository;

  private commentLikeRepo: CommentLikeRepository;

  constructor({
    threadRepository,
    commentLikeRepository,
    commentRepository,
  }: Deps) {
    this.threadRepo = threadRepository;
    this.commentRepo = commentRepository;
    this.commentLikeRepo = commentLikeRepository;
  }

  async toogleLikes(useCasePayload: Payload) {
    const { commentId, userId, threadId } = new NewCommentLikes(useCasePayload);
    await this.threadRepo.verifyThreadAvaibility(threadId);
    await this.commentRepo.verifyCommentAvaibility(commentId);
    await this.commentLikeRepo.toogleLike(userId, commentId);
  }
}
