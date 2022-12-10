import { ReqRefDefaults, ServerRoute } from "@hapi/hapi";
import Handler from "./handler";

const routes = (
  handler: Handler
): ServerRoute<ReqRefDefaults> | ServerRoute<ReqRefDefaults>[] => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: {
        strategy: "restricted_res",
      },
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadHandler,
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: {
        strategy: "restricted_res",
      },
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentByIdHandler,
    options: {
      auth: {
        strategy: "restricted_res",
      },
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
    options: {
      auth: {
        strategy: "restricted_res",
      },
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyByIdHandler,
    options: {
      auth: {
        strategy: "restricted_res",
      },
    },
  },
];
export default routes;
