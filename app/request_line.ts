const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "DELETE",
] as const;

export type HTTP_METHOD = (typeof HTTP_METHODS)[number];

export class RequestLine {
  method?: HTTP_METHOD;
  path?: string;
  version?: string;

  get valid() {
    return this.validMethod() && this.validPath() && this.validVersion();
  }

  validMethod() {
    return (
      Boolean(this.method) && HTTP_METHODS.includes(this.method as HTTP_METHOD)
    );
  }

  validPath() {
    return Boolean(this.path);
  }

  validVersion() {
    return this.version === "HTTP/1.1";
  }

  parseRequestLine(line: string) {
    const parts = line.split(/\s+/);
    this.method = parts[0] as HTTP_METHOD;
    this.path = parts[1];
    this.version = parts[2];
  }
}
