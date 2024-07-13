import { Headers } from "./headers.js";

type StatusCode = {
  code: number,
  message: string,
  error: boolean,
  hasBody: boolean
}

const STATUSES: Record<number, StatusCode> = {
  100: {
    code: 100,
    message: "Continue",
    error: false,
    hasBody: false
  },
  200: {
    code: 200,
    message: "OK",
    error: false,
    hasBody: true,
  },
  201: {
    code: 201,
    message: "Created",
    error: false,
    hasBody: true,
  },
  202: {
    code: 202,
    message: "Accepted",
    error: false,
    hasBody: true,
  },
  204: {
    code: 204,
    message: "No Content",
    error: false,
    hasBody: false,
  },
  404: {
    code: 404,
    message: "Not Found",
    error: true,
    hasBody: true
  }
}

export class Response {
  private statusCode = 200;
  private headers = new Headers();
  private contentType = "text/plain";
  private responseBody = "";
  private version = "HTTP/1.1";

  constructor() {}

  setVersion(newVersion: string) {
    this.version = newVersion;
  }

  setStatus(newStatus: number) {
    this.statusCode = newStatus;
  }

  setBody(newBody: string) {
    this.responseBody = newBody;
  }

  get status() {
    return STATUSES[this.statusCode] ?? {
      code: this.statusCode,
      message: "Unknown",
      error: this.statusCode >= 400,
      hasBody: true
    };
  }

  toString() {
    const status = this.status;

    if (status.hasBody) {
      this.headers.addHeader("Content-Type", this.contentType);
      this.headers.addHeader("Content-Length", this.responseBody.length.toString());
      return  `${this.version} ${status.code} ${status.message}\r\n${this.headers.toString()}\r\n${this.responseBody}`;
    }

    this.headers.addHeader("Content-Length", "0");
    return  `${this.version} ${status.code} ${status.message}\r\n${this.headers.toString()}\r\n`;
  }
}
