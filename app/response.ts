import { Headers } from "./headers.js";
import { gzip as gzipCb, Gzip } from "node:zlib";
import { promisify } from "node:util";

const gzip = promisify(gzipCb);

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
  },
  500: {
    code: 500,
    message: "Internal Server Error",
    error: true,
    hasBody: true
  }
}

export const VALID_COMPRESSION_SCHEMES = {
  "gzip": async (body: string): Promise<Buffer> => {
    const result = await gzip(Buffer.from(body));
 
    return result;
  },
  "uncompressed": async (body: string): Promise<Buffer> => Buffer.from(body),
}
type VALID_COMPRESSION_SCHEME = keyof typeof VALID_COMPRESSION_SCHEMES;

export class Response {
  private statusCode = 200;
  private headers = new Headers();
  private contentType = "text/plain";
  private responseBody = "";
  private version = "HTTP/1.1";
  private compressor: VALID_COMPRESSION_SCHEME = "uncompressed";

  constructor() {}

  setVersion(newVersion: string) {
    this.version = newVersion;
  }

  setStatus(newStatus: number) {
    this.statusCode = newStatus;
  }

  setBody(newBody: string | undefined) {
    this.responseBody = newBody ?? "";
  }

  setType(newType: string) {
    this.contentType = newType;
  }

  setCompression(newEncoding: string | undefined) {
    if (newEncoding && newEncoding !== "uncompressed" && Object.keys(VALID_COMPRESSION_SCHEMES).includes(newEncoding)) {
      this.headers.addHeader("Content-Encoding", newEncoding);
      this.compressor = newEncoding as VALID_COMPRESSION_SCHEME;
      return true;
    } else {
      this.headers.removeHeader("Content-Encoding");
      this.compressor = "uncompressed";
      return false;
    }
  }

  get status() {
    return STATUSES[this.statusCode] ?? {
      code: this.statusCode,
      message: "Unknown",
      error: this.statusCode >= 400,
      hasBody: true
    };
  }

  async toBuffer() {
    const status = this.status;
    const outputBuffers: Buffer[] = []

    outputBuffers.push(Buffer.from(`${this.version} ${status.code} ${status.message}\r\n`));

    if (status.hasBody) {
      const compressor = VALID_COMPRESSION_SCHEMES[this.compressor];
      const body = await compressor(this.responseBody);
      this.headers.addHeader("Content-Type", this.contentType);
      this.headers.addHeader("Content-Length", body.byteLength.toString());
      outputBuffers.push(this.headers.toBuffer());
      outputBuffers.push(body);
    } else {
      this.headers.addHeader("Content-Length", "0");
      outputBuffers.push(this.headers.toBuffer());
    }

    return Buffer.concat(outputBuffers);
  }
}
