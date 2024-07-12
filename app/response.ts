import type { Request } from "./request.js";
import type { Socket } from "node:net";

const STATUSES: Record<number, string> = {
  200: "OK",
  404: "Not Found"
}

export class Response {
  private sent = false;
  private statusCode = 200;

  constructor(private readonly request: Request, private readonly socket: Socket) {}

  setStatus(newStatus: number) {
    this.statusCode = newStatus;
  }

  get statusString() {
    return STATUSES[this.statusCode] ?? "Unknown";
  }

  send() {
    this.socket.write(`${this.request.version} ${this.statusCode} ${this.statusString}\r\n\r\n`);
  }
}
