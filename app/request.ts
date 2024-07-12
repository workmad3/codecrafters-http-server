import type { Socket } from "node:net";
import { Response } from "./response.js";

export class Request {
  private data: string = "";
  private finished = false;
  private response: Response;

  constructor(private readonly socket: Socket) {
    this.response = new Response(socket);
    this.initializeRequest();
  }

  initializeRequest() {
    this.socket.on("data", (data) => {
      if (this.finished) {
        throw new Error("Data received after request finished");
      }
      this.data += data.toString();

      this.end();
    });

    this.socket.on("end", () => {
      console.log(this.data);
    })

    this.socket.on("close", () => {
      if (!this.finished) {
        console.log("Request terminated");
      }
      this.socket.end();
    })
  }

  end() {
    this.response.send();
    this.finished = true;
    this.socket.end();
  }
}
