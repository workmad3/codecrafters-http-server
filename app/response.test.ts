import { Response } from "./response.js";

describe("Response", () => {
  it("Generates a 100 Continue", () => {
    const response = new Response();
    response.setStatus(100);

    expect(response.toString()).toBe("HTTP/1.1 100 Continue\r\ncontent-length: 0\r\n\r\n");
  });

  it("Ignores a body on a 100 Continue", () => {
    const response = new Response();
    response.setStatus(100);
    response.setBody("Test");

    expect(response.toString()).toBe("HTTP/1.1 100 Continue\r\ncontent-length: 0\r\n\r\n");
  });
  
  it("Generates a 200 OK", () => {
    const response = new Response();
    response.setStatus(200);

    expect(response.toString()).toBe("HTTP/1.1 200 OK\r\ncontent-type: text/plain\r\ncontent-length: 0\r\n\r\n");
  });

  it("Generates a 200 OK with a request body", () => {
    const response = new Response();
    response.setStatus(200);
    response.setBody("Test")

    expect(response.toString()).toBe("HTTP/1.1 200 OK\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest");
  });
  
  it("Generates a 201 Created", () => {
    const response = new Response();
    response.setStatus(201);

    expect(response.toString()).toBe("HTTP/1.1 201 Created\r\ncontent-type: text/plain\r\ncontent-length: 0\r\n\r\n");
  });

  it("Generates a 201 Created with a request body", () => {
    const response = new Response();
    response.setStatus(201);
    response.setBody("Test")

    expect(response.toString()).toBe("HTTP/1.1 201 Created\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest");
  });
  
  it("Generates a 202 Accepted", () => {
    const response = new Response();
    response.setStatus(202);

    expect(response.toString()).toBe("HTTP/1.1 202 Accepted\r\ncontent-type: text/plain\r\ncontent-length: 0\r\n\r\n");
  });

  it("Generates a 202 Accepted with a request body", () => {
    const response = new Response();
    response.setStatus(202);
    response.setBody("Test")

    expect(response.toString()).toBe("HTTP/1.1 202 Accepted\r\ncontent-type: text/plain\r\ncontent-length: 4\r\n\r\nTest");
  });
  
  it("Generates a 204 No Content", () => {
    const response = new Response();
    response.setStatus(204);

    expect(response.toString()).toBe("HTTP/1.1 204 No Content\r\ncontent-length: 0\r\n\r\n");
  });

  it("Ignores a body on a 204 No Content", () => {
    const response = new Response();
    response.setStatus(204);
    response.setBody("Test")

    expect(response.toString()).toBe("HTTP/1.1 204 No Content\r\ncontent-length: 0\r\n\r\n");
  });
})
