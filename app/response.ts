import type { Request } from "./request.js";
import { Headers } from "./headers.js";

const STATUSES: Record<number, string> = {
  200: "OK",
  404: "Not Found"
}

export class Response {
  private sent = false;
  private statusCode = 200;
  private headers = new Headers();
  private contentType = "text/plain";
  private responseBody = "";

  constructor(private readonly request: Request) {}

  setStatus(newStatus: number) {
    this.statusCode = newStatus;
  }

  setBody(newBody: string) {
    this.responseBody = newBody;
  }

  get statusString() {
    return STATUSES[this.statusCode] ?? "Unknown";
  }

  toString() {
    this.headers.addHeader("Content-Type", this.contentType);
    this.headers.addHeader("Content-Length", this.responseBody.length.toString());

    return `${this.request.version} ${this.statusCode} ${this.statusString}\r\n${this.headers.toString()}\r\n${this.responseBody}`;
  }
}
