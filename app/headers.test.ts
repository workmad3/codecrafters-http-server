import { Headers } from "./headers.js"

const headersToString = (h: Headers) => h.toBuffer().toString("binary");

describe("Headers", () => {
  it("Allows headers to be added", () => {
    const headers = new Headers();

    headers.addHeader("Some-Header", "foo");

    expect(headers.getHeader("Some-Header")).toBe("foo");
  });

  it("Treats headers as case insensitive", () => {
    const headers = new Headers();

    headers.addHeader("Some-Header", "foo");

    expect(headers.getHeader("sOmE-hEaDeR")).toBe("foo");
  });

  it("Allows headers to be removed", () => {
    const headers = new Headers();

    headers.addHeader("some-header", "foo");

    expect(headers.getHeader("some-header")).toBe("foo");

    headers.removeHeader("some-header");

    expect(headers.getHeader("some-header")).toBeUndefined();
  });

  it("Serialises empty headers to a newline", () => {
    const headers = new Headers();

    expect(headersToString(headers)).toBe("\r\n");
  });

  it("Serializes headers with normalised names and a blank line at the end", () => {
    const headers = new Headers();

    headers.addHeader("  Some-Header  ", "Foo");

    expect(headersToString(headers)).toBe("some-header: Foo\r\n\r\n");
  });

  it("Ignores malformed header lines", () => {
    const headers = new Headers();

    headers.parseHeader("Some-Header    Foo");

    expect(headers.getHeader("Some-Header")).toBeUndefined();
  })

  it("Trims whitespace from values", () => {
    const headers = new Headers();

    headers.addHeader("Some-Header", " Foo ");

    expect(headers.getHeader("Some-Header")).toBe("Foo");
  });

  it("Can parse a header line", () => {
    const headers = new Headers();

    headers.parseHeader("Some-Header: Foo");

    expect(headers.getHeader("Some-Header")).toBe("Foo");
  });

  it("Allows whitespace around header names", () => {
    const headers = new Headers();

    headers.parseHeader(" Some-Header : Foo");

    expect(headers.getHeader("some-header")).toBe("Foo");
  });
})
