import type { Socket } from "node:net";
import { Response } from "./response.js";
import { RequestLine } from "./request_line.js";
import { Headers } from "./headers.js";
import type { Handler } from "./handler.js";

export class Request {
  private data: string = "";
  private finished = false;
  private response: Response;
  private requestLine = new RequestLine();
  private headers = new Headers();

  constructor(private readonly socket: Socket, private readonly handler: Handler) {
    this.response = new Response(this);
    this.initializeRequest();
  }

  initializeRequest() {
    this.socket.on("data", (data) => {
      if (this.finished) {
        throw new Error("Data received after request finished");
      }
      this.data += data.toString();

      this.parseRequest();

      if (this.headersComplete()) {
        this.handler.run(this, this.response);
      }
    });

    this.socket.on("end", () => {
      if (!this.finished) {
        console.log("Request didn't terminate correctly");
        console.log(this.data);
      }
    })

    this.socket.on("close", () => {
      this.socket.end();
    })
  }

  end() {
    this.socket.write(this.response.toString());
    this.finished = true;
    this.socket.end();
  }

  parseRequest() {
    const lines = this.data.split("\r\n");
    this.requestLine.parseRequestLine(lines[0]);
  }

  headersComplete() {
    return this.requestLine.valid;
  }

  get method() {
    return this.requestLine.method;
  }

  get path() {
    return this.requestLine.path;
  }

  get version() {
    return this.requestLine.version;
  }
}
