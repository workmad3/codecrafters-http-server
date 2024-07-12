import type { Socket } from "node:net";

export class Response {
  private sent = false;
  private statusCode = 200;

  constructor(private readonly socket: Socket) {}

  send() {
    this.socket.write("HTTP/1.1 200 OK\r\n\r\n");
  }
}
