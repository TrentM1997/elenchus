import { IConfigRequestHandler } from "./types";

export class ConfigRequestHandler implements IConfigRequestHandler {
  public optionsPOST<TBody>(body: TBody | undefined): RequestInit {
    const options: RequestInit = {
      method: "POST",
      credentials: "include",
    };

    if (body === undefined) {
      return options;
    }

    return {
      ...options,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  }

  public optionsGET(signal: AbortSignal | undefined): RequestInit {
    const options: RequestInit = {
      method: "GET",
      credentials: "include",
    };

    if (signal === undefined) return options;

    return {
      ...options,
      signal,
    };
  }

  public optionsDELETE(): RequestInit {
    return {
      method: "DELETE",
      credentials: "include",
    };
  }
}
