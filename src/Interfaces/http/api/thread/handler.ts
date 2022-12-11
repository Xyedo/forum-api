import { ResponseToolkit, Request } from "@hapi/hapi";
import ThreadUseCase from "../../../../Applications/use_case/ThreadUseCase";
import { Container } from "../../../../Infrastructures/container";
import { IRequest, Payload } from "../../../../Commons/types";
import CommentUseCase from "../../../../Applications/use_case/CommentUseCase";
import ReplyUseCase from "../../../../Applications/use_case/ReplyUseCase";
import CommentLikesUseCase from "../../../../Applications/use_case/CommentLikesUseCase";

class ThreadHandler {
  private container: Container;

  constructor(container: Container) {
    this.container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postThreadHandler(request: IRequest, h: ResponseToolkit) {
    const threadUseCase = this.container.getInstance(
      ThreadUseCase.name
    ) as ThreadUseCase;
    const { id: userId } = request.auth.credentials;

    const addedThread = await threadUseCase.addNewThread(
      userId,
      request.payload as Payload
    );

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request: IRequest, h: ResponseToolkit) {
    const commentUseCase = this.container.getInstance(
      CommentUseCase.name
    ) as CommentUseCase;
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload as Payload;
    const addedComment = await commentUseCase.addNewCommentToThread({
      userId,
      threadId,
      content,
    });
    return h
      .response({
        status: "success",
        data: {
          addedComment,
        },
      })
      .code(201);
  }

  async deleteCommentByIdHandler(request: IRequest, h: ResponseToolkit) {
    const commentUseCase = this.container.getInstance(
      CommentUseCase.name
    ) as CommentUseCase;
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await commentUseCase.deleteComment(threadId, commentId, userId);
    return h
      .response({
        status: "success",
      })
      .code(200);
  }

  async postReplyHandler(request: IRequest, h: ResponseToolkit) {
    const replyUseCase = this.container.getInstance(
      ReplyUseCase.name
    ) as ReplyUseCase;
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const { content } = request.payload as Payload;
    const addedReply = await replyUseCase.addNewReplyToComment({
      commentId,
      content,
      threadId,
      userId,
    });
    return h
      .response({
        status: "success",
        data: {
          addedReply,
        },
      })
      .code(201);
  }

  async deleteReplyByIdHandler(request: IRequest, h: ResponseToolkit) {
    const replyUseCase = this.container.getInstance(
      ReplyUseCase.name
    ) as ReplyUseCase;
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    await replyUseCase.deleteReply(threadId, commentId, userId, replyId);
    return h
      .response({
        status: "success",
      })
      .code(200);
  }

  async getThreadHandler(request: Request, h: ResponseToolkit) {
    const threadUseCase = this.container.getInstance(
      ThreadUseCase.name
    ) as ThreadUseCase;
    const { threadId } = request.params;
    const thread = await threadUseCase.getDetailThread(threadId);
    return h
      .response({
        status: "success",
        data: {
          thread,
        },
      })
      .code(200);
  }

  async putCommentLikeHandler(request: IRequest, h: ResponseToolkit) {
    const commentLikeUseCase = this.container.getInstance(
      CommentLikesUseCase.name
    ) as CommentLikesUseCase;
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    await commentLikeUseCase.toogleLikes({ threadId, commentId, userId });
    return h
      .response({
        status: "success",
      })
      .code(200);
  }
}
export default ThreadHandler;
