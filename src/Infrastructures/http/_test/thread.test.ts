import { Server } from "@hapi/hapi";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper";
import ThreadTableTestHelper from "../../../../tests/ThreadTableTestHelper";
import pool from "../../database/postgres/pool";
import createServer from "../createServer";
import container from "../../container";

describe("/threads endpoint", () => {
  beforeEach(async () => {
    // add user
    const server = await createServer(container);
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });
  });
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and presisted thread", async () => {
      // arrange
      const requestPayload = {
        title: "hmm apa yah",
        body: "gaes, kalian lu aman gua amin gasiiiee!",
      };
      const server = await createServer(container);

      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      const { id, title, owner } = responseJson.data.addedThread;
      expect(id).toBeDefined();
      expect(title).toEqual(requestPayload.title);
      expect(owner).toBeDefined();

      const resp = await ThreadTableTestHelper.findThreadById(id);
      expect(resp).toHaveLength(1);
    });
    it("should response to 400 when request payload did not contain req props", async () => {
      // arrange
      const requestPayload = {
        title: "hmm apa yah",
      };
      const server = await createServer(container);

      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });
    it("should response to 401 when not providing auth", async () => {
      // arange
      const requestPayload = {
        title: "hmm apa yah",
        body: "gaes, kalian lu aman gua amin gasiiiee!",
      };
      const server = await createServer(container);
      // action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });
      // assert
      expect(response.statusCode).toEqual(401);
    });
  });
  describe("when POST /threads/{threadId}/comments", () => {
    const setup = async (server: Server): Promise<string> => {
      const requestPayload = {
        title: "hmm apa yah",
        body: "gaes, kalian lu aman gua amin gasiiiee!",
      };

      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken: tsAcessToken },
      } = JSON.parse(loginResponse.payload);

      // create a new thread
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${tsAcessToken}`,
        },
      });
      const {
        data: {
          addedThread: { id },
        },
      } = JSON.parse(response.payload);
      return id as string;
    };
    it("should response 201 when valid", async () => {
      // arrange
      const server = await createServer(container);
      const threadId = await setup(server);
      // add user to comment
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding2",
          password: "secret",
          fullname: "Dicoding2 Indonesia",
        },
      });
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding2", password: "secret" },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const payload = {
        content: "apa kabar kak?",
      };
      // action

      const resp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(resp.statusCode).toEqual(201);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("success");
      expect(respJson.data.addedComment).toBeDefined();
      const { id: commentId, content, owner } = respJson.data.addedComment;
      expect(commentId).toBeDefined();
      expect(content).toEqual(payload.content);
      expect(owner).toBeDefined();
    });
    it("should response 404 when thread is not found", async () => {
      // arrange
      const server = await createServer(container);
      // add user to comment
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding2",
          password: "secret",
          fullname: "Dicoding2 Indonesia",
        },
      });
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding2", password: "secret" },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const payload = {
        content: "apa kabar kak?",
      };
      // action

      const resp = await server.inject({
        method: "POST",
        url: `/threads/pasti-salah/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(404);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
    it("should response 400 invalid request body", async () => {
      // arrange
      const server = await createServer(container);
      const threadId = await setup(server);

      // add user to comment
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding2",
          password: "secret",
          fullname: "Dicoding2 Indonesia",
        },
      });
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding2", password: "secret" },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const payload = {
        content: 123,
      };
      // action

      const resp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(resp.statusCode).toEqual(400);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
  });
  const setupTillComment = async (
    server: Server
  ): Promise<{
    commentId: string;
    threadId: string;
    accessToken: string;
  }> => {
    const requestPayload = {
      title: "hmm apa yah",
      body: "gaes, kalian lu aman gua amin gasiiiee!",
    };

    // login to get accessToken
    let loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: { username: "dicoding", password: "secret" },
    });
    const {
      data: { accessToken: tsAcessToken },
    } = JSON.parse(loginResponse.payload);

    // create a new thread
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${tsAcessToken}`,
      },
    });
    const {
      data: {
        addedThread: { id: threadId },
      },
    } = JSON.parse(response.payload);
    // add user to comment
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding2",
        password: "secret",
        fullname: "Dicoding2 Indonesia",
      },
    });
    // login to get accessToken
    loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: { username: "dicoding2", password: "secret" },
    });
    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    const payload = {
      content: "apa kabar kak?",
    };
    // action

    const resp = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments`,
      payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const {
      data: {
        addedComment: { id: commentId },
      },
    } = JSON.parse(resp.payload);
    return { commentId, threadId, accessToken };
  };
  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("response 200 when all valid", async () => {
      // arrange
      const server = await createServer(container);
      const {
        threadId,
        commentId,
        accessToken: commenterAccessToken,
      } = await setupTillComment(server);

      // action
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${commenterAccessToken}`,
        },
      });
      // assert
      expect(resp.statusCode).toBe(200);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("success");
    });
    it("should return 404 when invalid comment", async () => {
      // arrange
      const server = await createServer(container);
      const { threadId, accessToken: commenterAccessToken } =
        await setupTillComment(server);

      // action
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${"gatau-lah"}`,
        headers: {
          Authorization: `Bearer ${commenterAccessToken}`,
        },
      });
      // assert
      expect(resp.statusCode).toBe(404);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
    it("should return 404 when invalid thread", async () => {
      // arrange
      const server = await createServer(container);
      const { commentId, accessToken: commenterAccessToken } =
        await setupTillComment(server);

      // action
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${"gatau-lah"}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${commenterAccessToken}`,
        },
      });
      // assert
      expect(resp.statusCode).toBe(404);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
    it("should return 403 when forbidden delete another user comment", async () => {
      // arrange
      const server = await createServer(container);
      const { threadId, commentId } = await setupTillComment(server);
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken: tsAcessToken },
      } = JSON.parse(loginResponse.payload);
      // action
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${tsAcessToken}`,
        },
      });
      // assert
      expect(resp.statusCode).toBe(403);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
  });
  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should return 201 when all valid", async () => {
      // arrange
      const server = await createServer(container);
      const { commentId, threadId } = await setupTillComment(server);
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken: tsAcessToken },
      } = JSON.parse(loginResponse.payload);
      const payload = {
        content: "btul bgt gan!",
      };
      // action
      const resp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${tsAcessToken}`,
        },
        payload,
      });
      expect(resp.statusCode).toEqual(201);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("success");
      expect(respJson.data.addedReply).toBeDefined();
      const { owner, id, content } = respJson.data.addedReply;
      expect(owner).toBeDefined();
      expect(id).toBeDefined();
      expect(content).toEqual(payload.content);
    });
    it("should return 404 when threadId is not found", async () => {
      // arrange
      const server = await createServer(container);
      const { commentId } = await setupTillComment(server);
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken: tsAcessToken },
      } = JSON.parse(loginResponse.payload);
      const payload = {
        content: "btul bgt gan!",
      };
      // action
      const resp = await server.inject({
        method: "POST",
        url: `/threads/${"gatau-deh"}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${tsAcessToken}`,
        },
        payload,
      });
      expect(resp.statusCode).toEqual(404);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
    it("should return 404 when commentId is not found", async () => {
      // arrange
      const server = await createServer(container);
      const { threadId } = await setupTillComment(server);
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken: tsAcessToken },
      } = JSON.parse(loginResponse.payload);
      const payload = {
        content: "btul bgt gan!",
      };
      // action
      const resp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${"gatau-deh"}/replies`,
        headers: {
          Authorization: `Bearer ${tsAcessToken}`,
        },
        payload,
      });
      // assert
      expect(resp.statusCode).toEqual(404);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
    it("should return 400 when payload didnt match the req", async () => {
      // arrange
      const server = await createServer(container);
      const { commentId, threadId } = await setupTillComment(server);
      // login to get accessToken
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding", password: "secret" },
      });
      const {
        data: { accessToken: tsAcessToken },
      } = JSON.parse(loginResponse.payload);
      const payload = {
        content: 123,
      };
      // action
      const resp = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: {
          Authorization: `Bearer ${tsAcessToken}`,
        },
        payload,
      });
      expect(resp.statusCode).toEqual(400);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("fail");
      expect(respJson.message).toBeDefined();
    });
  });
  const setupTillReplyId = async (
    server: Server
  ): Promise<{
    commentId: string;
    threadId: string;
    accessToken: string;
    replyId: string;
  }> => {
    const requestPayload = {
      title: "hmm apa yah",
      body: "gaes, kalian lu aman gua amin gasiiiee!",
    };

    // login to get accessToken
    let loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: { username: "dicoding", password: "secret" },
    });
    const {
      data: { accessToken: tsAcessToken },
    } = JSON.parse(loginResponse.payload);

    // create a new thread
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: {
        Authorization: `Bearer ${tsAcessToken}`,
      },
    });
    const {
      data: {
        addedThread: { id: threadId },
      },
    } = JSON.parse(response.payload);
    // add user to comment
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding2",
        password: "secret",
        fullname: "Dicoding2 Indonesia",
      },
    });
    // login to get accessToken
    loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: { username: "dicoding2", password: "secret" },
    });
    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    const payload = {
      content: "apa kabar kak?",
    };
    // action

    const resp = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments`,
      payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const {
      data: {
        addedComment: { id: commentId },
      },
    } = JSON.parse(resp.payload);
    const replyPayload = {
      content: "pertamax gan!",
    };
    const replyResp = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: replyPayload,
      headers: {
        Authorization: `Bearer ${tsAcessToken}`,
      },
    });
    const {
      data: {
        addedReply: { id: replyId },
      },
    } = JSON.parse(replyResp.payload);
    return { commentId, threadId, accessToken: tsAcessToken, replyId };
  };
  describe("when DELETE  /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should return 200 when valid delete", async () => {
      const server = await createServer(container);
      const { threadId, commentId, replyId, accessToken } =
        await setupTillReplyId(server);
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(200);
      const { status } = JSON.parse(resp.payload);
      expect(status).toEqual("success");
    });
    it("should return 403 when invalid reply owner", async () => {
      const server = await createServer(container);
      const { threadId, commentId, replyId } = await setupTillReplyId(server);
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: { username: "dicoding2", password: "secret" },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(403);
      const { status, message } = JSON.parse(resp.payload);
      expect(status).toEqual("fail");
      expect(message).toBeDefined();
    });
    it("should return 404 when invalid threadId", async () => {
      const server = await createServer(container);
      const { commentId, replyId, accessToken } = await setupTillReplyId(
        server
      );
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${"gatau-deh"}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(404);
      const { status, message } = JSON.parse(resp.payload);
      expect(status).toEqual("fail");
      expect(message).toBeDefined();
    });
    it("should return 404 when invalid commentId", async () => {
      const server = await createServer(container);
      const { threadId, replyId, accessToken } = await setupTillReplyId(server);
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${"gatau-deh"}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(404);
      const { status, message } = JSON.parse(resp.payload);
      expect(status).toEqual("fail");
      expect(message).toBeDefined();
    });
    it("should return 404 when invalid replyId", async () => {
      const server = await createServer(container);
      const { threadId, commentId, accessToken } = await setupTillReplyId(
        server
      );
      const resp = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${"gatau-deh"}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(404);
      const { status, message } = JSON.parse(resp.payload);
      expect(status).toEqual("fail");
      expect(message).toBeDefined();
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should return 200 when all valid", async () => {
      const server = await createServer(container);
      const { threadId } = await setupTillReplyId(server);
      // action
      const resp = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });
      expect(resp.statusCode).toEqual(200);
    });
    it("should return 404 when threadId is notFound", async () => {
      const server = await createServer(container);
      const resp = await server.inject({
        method: "GET",
        url: `/threads/hahahahah`,
      });
      expect(resp.statusCode).toEqual(404);
    });
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should return 200 when likes", async () => {
      const server = await createServer(container);
      const { accessToken, commentId, threadId } = await setupTillComment(
        server
      );
      const resp = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(resp.statusCode).toEqual(200);
      const respJson = JSON.parse(resp.payload);
      expect(respJson.status).toEqual("success");
    });
  });
});
