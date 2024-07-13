import process, { env, argv } from "node:process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Handler } from "./handler.js";
import { HttpServer } from "./server.js";

const HOST = env.HOST ?? "localhost";
const PORT = Number(env.PORT ?? 4221);

const directoryIndex = argv.findIndex((arg) => arg === "--directory");
const filesDirectory = directoryIndex >= 0 ? argv[directoryIndex + 1] : "/tmp";

const app = new Handler();

app.addHandler("GET", "/", (_request, _response) => {})

app.addHandler("GET", /\/echo\/(?<str>\w+)/, (_request, response, matches) => {
  response.setBody(`${matches.str}`);
})

app.addHandler("GET", "/user-agent", (request, response) => {
  response.setBody(request.getHeader("User-Agent"));
})

app.addHandler("GET", /\/files\/(?<filename>(\w|-)+)/, async (request, response, matches) => {
  try {
    const contents = await readFile(join(filesDirectory, matches.filename), "ascii");
    response.setType("application/octet-stream");
    response.setBody(contents);
  } catch(e) {
    response.setStatus(404);
  }
});

const server = new HttpServer(PORT, HOST, app);
server.start(() => console.log("Starting server"));

process.once('SIGINT', () => server.stop(() => console.log("Closing server")));
