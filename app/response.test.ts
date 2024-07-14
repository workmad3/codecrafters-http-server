import { Response } from "./response.js";
import { gunzip as gunzipCb } from "node:zlib";
import { promisify } from "node:util";

const gunzip = promisify(gunzipCb);
const toString = async (r: Response) => (await r.toBuffer()).toString("binary");

describe("Response", () => {
  it("Generates a 100 Continue", async () => {
    const response = new Response();
    response.setStatus(100);

    expect(await toString(response)).toBe(
      "HTTP/1.1 100 Continue\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Ignores a body on a 100 Continue", async () => {
    const response = new Response();
    response.setStatus(100);
    response.setBody("Test");

    expect(await toString(response)).toBe(
      "HTTP/1.1 100 Continue\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Generates a 200 OK", async () => {
    const response = new Response();
    response.setStatus(200);

    expect(await toString(response)).toBe(
      "HTTP/1.1 200 OK\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Generates a 200 OK with a request body", async () => {
    const response = new Response();
    response.setStatus(200);
    response.setBody("Test");

    expect(await toString(response)).toBe(
      "HTTP/1.1 200 OK\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest"
    );
  });

  it("Generates a 201 Created", async () => {
    const response = new Response();
    response.setStatus(201);

    expect(await toString(response)).toBe(
      "HTTP/1.1 201 Created\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Generates a 201 Created with a request body", async () => {
    const response = new Response();
    response.setStatus(201);
    response.setBody("Test");

    expect(await toString(response)).toBe(
      "HTTP/1.1 201 Created\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest"
    );
  });

  it("Generates a 202 Accepted", async () => {
    const response = new Response();
    response.setStatus(202);

    expect(await toString(response)).toBe(
      "HTTP/1.1 202 Accepted\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Generates a 202 Accepted with a request body", async () => {
    const response = new Response();
    response.setStatus(202);
    response.setBody("Test");

    expect(await toString(response)).toBe(
      "HTTP/1.1 202 Accepted\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest"
    );
  });

  it("Generates a 204 No Content", async () => {
    const response = new Response();
    response.setStatus(204);

    expect(await toString(response)).toBe(
      "HTTP/1.1 204 No Content\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Ignores a body on a 204 No Content", async () => {
    const response = new Response();
    response.setStatus(204);
    response.setBody("Test");

    expect(await toString(response)).toBe(
      "HTTP/1.1 204 No Content\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Can gzip the response body", async () => {
    const response = new Response();
    response.setCompression("gzip");
    response.setBody("Test");

    const responseData = await response.toBuffer();
    const contentLength = Number(response.getHeader("Content-Length"));

    const body = Buffer.copyBytesFrom(
      responseData,
      responseData.byteLength - contentLength,
      contentLength
    );

    expect((await gunzip(body)).toString()).toBe("Test");
  });

  it("Can set the response version", async () => {
    const response = new Response();
    response.setVersion("HTTP/1.0");

    expect(await toString(response)).toBe(
      "HTTP/1.0 200 OK\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Can set the content type", async () => {
    const response = new Response();
    response.setBody("Test");
    response.setType("application/octet-stream");

    expect(await toString(response)).toBe(
      "HTTP/1.1 200 OK\r\ncontent-type: application/octet-stream\r\ncontent-length: 4\r\n\r\nTest"
    );
  });

  it("Uses Unknown for a message with an unknown status code", async () => {
    const response = new Response();
    response.setStatus(999);

    expect(await toString(response)).toBe(
      "HTTP/1.1 999 Unknown\r\ncontent-length: 0\r\n\r\n"
    );
  });

  it("Sets the content encoding header when setting compression", () => {
    const response = new Response();
    response.setCompression("gzip");

    expect(response.getHeader("Content-Encoding")).toBe("gzip");
  });

  it("Clears the content encoding header when setting compression to uncompressed", () => {
    const response = new Response();
    response.setCompression("uncompressed");

    expect(response.getHeader("Content-Encoding")).toBeUndefined();
  });

  it("Clears the body when setting to undefined", async () => {
    const response = new Response();
    response.setStatus(200);
    response.setBody("Test");

    expect(await toString(response)).toBe(
      "HTTP/1.1 200 OK\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest"
    );

    response.setBody(undefined);

    expect(await toString(response)).toBe(
      "HTTP/1.1 200 OK\r\ncontent-length: 0\r\n\r\n"
    );
  });
});
