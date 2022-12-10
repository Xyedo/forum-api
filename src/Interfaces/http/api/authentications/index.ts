import { Server } from "@hapi/hapi";
import routes from "./routes";
import AuthenticationsHandler from "./handler";
import { Container } from "../../../../Infrastructures/container";

type Deps = {
  container: Container;
};
export default {
  name: "authentications",
  register: async (server: Server, { container }: Deps) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};
