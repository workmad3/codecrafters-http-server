import { createServer } from "node:net";
import { env } from "node:process";

import { Request } from "./request.js";
import { Handler } from "./handler.js";

const HOST = env.HOST ?? "localhost";
const PORT = Number(env.PORT ?? 4221);

const app = new Handler();

app.addHandler("GET", "/", () => {
  console.log("Index");
})

const server = createServer((s) => {
  const request = new Request(s, app);
  s.on("close", () => s.end());
  s.on("end", () => console.log("Connection closed"));
});

server.on("listening", () => {
  console.log(`Listening on ${HOST}:${PORT}`)
});

server.on("connection", (s) => {
  console.log("Connection started");
})

server.listen(PORT, HOST);
