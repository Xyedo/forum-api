import Jwt from "@hapi/jwt";
import Hapi from "@hapi/hapi";

import ClientError from "../../Commons/exceptions/ClientError";
import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator";
import users from "../../Interfaces/http/api/users";
import authentications from "../../Interfaces/http/api/authentications";
import thread from "../../Interfaces/http/api/thread";
import { Container } from "../container";

const createServer = async (container: Container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });
  await server.register([Jwt]);
  server.auth.strategy("restricted_res", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: async (artifacts: { decoded: any }) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: thread,
      options: { container },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!(translatedError as any).isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  return server;
};

export default createServer;
