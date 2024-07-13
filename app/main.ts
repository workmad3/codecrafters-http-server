import process, { env } from "node:process";
import { Handler } from "./handler.js";
import { HttpServer } from "./server.js";

const HOST = env.HOST ?? "localhost";
const PORT = Number(env.PORT ?? 4221);

const app = new Handler();

app.addHandler("GET", "/", (_request, _response) => {})

app.addHandler("GET", /\/echo\/(?<str>\w+)/, (_request, response, matches) => {
  response.setBody(`${matches.str}`);
})

app.addHandler("GET", "/user-agent", (request, response) => {
  response.setBody(request.getHeader("User-Agent"));
})

const server = new HttpServer(PORT, HOST, app);
server.start(() => console.log("Starting server"));

process.once('SIGINT', () => server.stop(() => console.log("Closing server")));
