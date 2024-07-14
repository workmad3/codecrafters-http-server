import { Response } from "./response.js";

const toString = async (r: Response) => (await r.toBuffer()).toString("binary");

describe("Response", () => {
  it("Generates a 100 Continue", async () => {
    const response = new Response();
    response.setStatus(100);

    expect(await toString(response)).toBe("HTTP/1.1 100 Continue\r\ncontent-length: 0\r\n\r\n");
  });

  it("Ignores a body on a 100 Continue", async () => {
    const response = new Response();
    response.setStatus(100);
    response.setBody("Test");

    expect(await toString(response)).toBe("HTTP/1.1 100 Continue\r\ncontent-length: 0\r\n\r\n");
  });
  
  it("Generates a 200 OK", async () => {
    const response = new Response();
    response.setStatus(200);

    expect(await toString(response)).toBe("HTTP/1.1 200 OK\r\ncontent-length: 0\r\n\r\n");
  });

  it("Generates a 200 OK with a request body", async () => {
    const response = new Response();
    response.setStatus(200);
    response.setBody("Test")

    expect(await toString(response)).toBe("HTTP/1.1 200 OK\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest");
  });
  
  it("Generates a 201 Created", async () => {
    const response = new Response();
    response.setStatus(201);

    expect(await toString(response)).toBe("HTTP/1.1 201 Created\r\ncontent-length: 0\r\n\r\n");
  });

  it("Generates a 201 Created with a request body", async() => {
    const response = new Response();
    response.setStatus(201);
    response.setBody("Test")

    expect(await toString(response)).toBe("HTTP/1.1 201 Created\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest");
  });
  
  it("Generates a 202 Accepted", async () => {
    const response = new Response();
    response.setStatus(202);

    expect(await toString(response)).toBe("HTTP/1.1 202 Accepted\r\ncontent-length: 0\r\n\r\n");
  });

  it("Generates a 202 Accepted with a request body", async () => {
    const response = new Response();
    response.setStatus(202);
    response.setBody("Test")

    expect(await toString(response)).toBe("HTTP/1.1 202 Accepted\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest");
  });
  
  it("Generates a 204 No Content", async () => {
    const response = new Response();
    response.setStatus(204);

    expect(await toString(response)).toBe("HTTP/1.1 204 No Content\r\ncontent-length: 0\r\n\r\n");
  });

  it("Ignores a body on a 204 No Content", async () => {
    const response = new Response();
    response.setStatus(204);
    response.setBody("Test")

    expect(await toString(response)).toBe("HTTP/1.1 204 No Content\r\ncontent-length: 0\r\n\r\n");
  });
})
