import { RequestLine } from "./request_line.js";

describe("RequestLine", () => {
  const line = new RequestLine();

  it("Extracts the HTTP method", () => {
    line.parseRequestLine("GET /path HTTP/1.1");

    expect(line.method).toBe("GET");
    expect(line.validMethod()).toBe(true);
  });

  it("Isn't valid with an incorrect method", () => {
    line.parseRequestLine("FOO /path HTTP/1.1");

    expect(line.method).toBe("FOO");
    expect(line.validMethod()).toBe(false);
    expect(line.valid).toBe(false);
  });

  it("Extracts the path", () => {
    line.parseRequestLine("GET /path HTTP/1.1");

    expect(line.path).toBe("/path");
    expect(line.validPath()).toBe(true);
  });

  it("Extracts the version", () => {
    line.parseRequestLine("GET /path HTTP/1.1");

    expect(line.version).toBe("HTTP/1.1");
    expect(line.validVersion()).toBe(true);
  });

  it("Isn't valid with an incorrect version", () => {
    line.parseRequestLine("GET /path HTTP/1.0");

    expect(line.version).toBe("HTTP/1.0");
    expect(line.validVersion()).toBe(false);
    expect(line.valid).toBe(false);
  });

  it("Is valid if every part is valid", () => {
    line.parseRequestLine("GET /path HTTP/1.1");

    expect(line.validMethod()).toBe(true);
    expect(line.validPath()).toBe(true);
    expect(line.validVersion()).toBe(true);
    expect(line.valid).toBe(true);
  });
});
