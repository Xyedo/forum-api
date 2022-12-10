import { Server } from "@hapi/hapi";
import ThreadHandler from "./handler";
import routes from "./routes";
import { Container } from "../../../../Infrastructures/container";

type Deps = {
  container: Container;
};
export default {
  name: "threads",
  register: async (server: Server, { container }:Deps) => {
    const threadHandler = new ThreadHandler(container);
    server.route(routes(threadHandler));
  },
};
