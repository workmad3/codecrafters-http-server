import { createServer } from "node:net";
import { env } from "node:process";

import { Request } from "./request.js";
import { Handler } from "./handler.js";

const HOST = env.HOST ?? "localhost";
const PORT = Number(env.PORT ?? 4221);

const app = new Handler();

app.addHandler("GET", "/", (_request, _response) => {})

app.addHandler("GET", /\/echo\/(?<str>\w+)/, (_request, response, matches) => {
  response.setBody(`${matches.str}\n`);
})

const server = createServer((s) => new Request(s, app));

server.on("listening", () => {
  console.log(`Listening on ${HOST}:${PORT}`)
});

server.listen(PORT, HOST);
