import { createServer, type Server } from "node:net";
import { Request } from "./request.js";
import type { Handler } from "./handler.js";

export class HttpServer {
  private socketServer: Server;

  constructor(
    private readonly port = 3000,
    private readonly host = "localhost",
    app: Handler
  ) {
    this.socketServer = createServer((s) => new Request(s, app));
  }

  start(callback?: () => void) {
    this.socketServer.listen(this.port, this.host, callback);
  }

  stop(callback?: () => void) {
    this.socketServer.close(callback);
  }
}
