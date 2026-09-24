import { RouteConfigDefinition } from "@elenchus/contracts";
import { RequestOptions } from "./requestOptions";

export interface IRequestUrlBuilder {
  build<const R extends RouteConfigDefinition>(
    route: R,
    options: RequestOptions<NoInfer<R>>,
  ): string;
}

export class RequestUrlBuilder implements IRequestUrlBuilder {
  build<const R extends RouteConfigDefinition>(
    route: R,
    options: RequestOptions<NoInfer<R>>,
  ): string {
    let path: string = route.path;

    for (const [key, value] of Object.entries(options.params ?? {})) {
      path = path.replace(`:${key}`, encodeURIComponent(String(value)));
    }

    if (!options.query) {
      return path;
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(options.query)) {
      searchParams.set(key, String(value));
    }

    return `${path}?${searchParams.toString()}`;
  }
}
