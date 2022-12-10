import createServer from "./Infrastructures/http/createServer";
import container from "./Infrastructures/container";

require("dotenv").config();

createServer(container).then((server) => {
  // eslint-disable-next-line no-console
  server.start().then(() => console.log(`server start at ${server.info.uri}`));
});
