import type { Request} from "./request.js";
import type { Response } from "./response.js";
import type { HTTP_METHOD } from "./request_line.js";

export type HandlerFunction = (request: Request, response: Response) => void;
export type HandlerFunctionWithMatches = (request: Request, response: Response, matches: Record<string, string>) => void;
export class Handler {
  private handlers = new Map<HTTP_METHOD, Map<string, HandlerFunction>>();
  private regexpHandlers = new Map<HTTP_METHOD, Map<RegExp, HandlerFunctionWithMatches>>();

  addHandler(method: HTTP_METHOD, path: RegExp, func: HandlerFunctionWithMatches): void;
  addHandler(method: HTTP_METHOD, path: string, func: HandlerFunction): void;
  addHandler(method: HTTP_METHOD, path: string | RegExp, func: HandlerFunction | HandlerFunctionWithMatches): void {
    if (path instanceof RegExp) {
      if (!this.regexpHandlers.has(method)) {
        this.regexpHandlers.set(method, new Map<RegExp, HandlerFunctionWithMatches>());
      }
      this.regexpHandlers.get(method)?.set(path, func);
      return;
    }

    if (!this.handlers.has(method)) {
      this.handlers.set(method, new Map<string, HandlerFunction>());
    }
    this.handlers.get(method)?.set(path, func as HandlerFunction);
  }

  hasHandler(method: HTTP_METHOD, path: string) {
    const regexps = this.regexpHandlers.get(method);
    if (regexps) {
      for (const handler of regexps) {
        const match = path.match(handler[0]);
        if (match) {
          return true;
        }
      }
    }
    return this.handlers.has(method) && this.handlers.get(method)?.has(path);
  }

  getHandler(method: HTTP_METHOD, path: string) {
    const regexps = this.regexpHandlers.get(method);
    if (regexps) {
      for (const handler of regexps) {
        const match = path.match(handler[0]);
        if (match) {
          return (request: Request, response: Response) => handler[1](request, response, match.groups ?? {});
        }
      }
    }
    return this.handlers.get(method)?.get(path);
  }

  run(request: Request, response: Response) {
    if (!this.hasHandler(request.method!, request.path!)) {
      response.setStatus(404);
    } else {
      this.getHandler(request.method!, request.path!)?.(request, response);
    }
    request.end();
  }
}
