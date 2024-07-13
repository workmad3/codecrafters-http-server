export class Headers {
  private headers = new Map<string, string>();

  parseHeader(line: string) {
    if(!line.includes(":")) {
      return;
    }

    const [name, ...value] = line.split(":");
    this.addHeader(name, value.join(":").trim());
  }

  addHeader(name: string, value: string) {
    this.headers.set(name.toLowerCase(), value);
  }

  hasHeader(name: string) {
    this.headers.has(name.toLowerCase())
  }

  getHeader(name: string) {
    return this.headers.get(name.toLowerCase());
  }

  toString() {
    return [...this.headers].map(header => `${header[0]}: ${header[1]}\r\n`).join("");
  }
}
