import { createServer } from "node:net";

const server = createServer((s) => {
  s.on("close", () => s.end());
});

server.listen(4221, "localhost");
