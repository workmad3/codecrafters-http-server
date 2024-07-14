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
    this.headers.set(this.normaliseName(name), value.trim());
  }

  removeHeader(name: string) {
    this.headers.delete(this.normaliseName(name));
  }

  getHeader(name: string) {
    return this.headers.get(this.normaliseName(name));
  }

  toBuffer() {
    return [...this.headers].reverse().reduce((b, h) => 
      Buffer.concat(
        [Buffer.from(`${h[0]}: ${h[1]}\r\n`), b]
      ), Buffer.from("\r\n")
    )
  }

  private normaliseName(name: string) {
    return name.trim().toLowerCase();
  }
}
