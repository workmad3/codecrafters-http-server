import type { Request} from "./request.js";
import type { Response } from "./response.js";
import type { HTTP_METHOD } from "./request_line.js";

export type HandlerFunction = (request: Request, response: Response) => void;
export class Handler {
  private handlers = new Map<HTTP_METHOD, Map<string, HandlerFunction>>();

  addHandler(method: HTTP_METHOD, path: string, func: HandlerFunction) {
    if (!this.handlers.has(method)) {
      this.handlers.set(method, new Map<string, HandlerFunction>);
    }

    this.handlers.get(method)?.set(path, func);
  }

  hasHandler(method: HTTP_METHOD, path: string) {
    return this.handlers.has(method) && this.handlers.get(method)?.has(path);
  }

  run(request: Request, response: Response) {
    if (!this.hasHandler(request.method!, request.path!)) {
      response.setStatus(404);
    } else {
      this.handlers.get(request.method!)?.get(request.path!)?.(request, response);
    }
    request.end();
  }
}
