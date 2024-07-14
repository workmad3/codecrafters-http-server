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

  removeHeader(name: string) {
    this.headers.delete(name);
  }

  hasHeader(name: string) {
    this.headers.has(name.toLowerCase())
  }

  getHeader(name: string) {
    return this.headers.get(name.toLowerCase());
  }

  toBuffer() {
    return [...this.headers].reduce((b, h) => 
      Buffer.concat(
        [Buffer.from(`${h[0]}: ${h[1]}\r\n`), b]
      ), Buffer.from("\r\n")
    )
  }
}
