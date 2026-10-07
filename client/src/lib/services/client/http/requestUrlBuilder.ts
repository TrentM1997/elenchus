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
    return this.buildUrl(route, options);
  }

  private buildUrl<const R extends RouteConfigDefinition>(
    route: R,
    options: RequestOptions<NoInfer<R>>,
  ): string {
    let path = this.applyParams(route.path, options.params);
    path = this.applyQuery(path, options.query);

    return this.applyApiOrigin(path);
  }

  private applyQuery(
    path: string,
    query: Record<string, unknown> | undefined,
  ): string {
    if (!query) {
      return path;
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      searchParams.set(key, String(value));
    }

    return `${path}?${searchParams.toString()}`;
  }

  private applyParams(
    path: string,
    params: Record<string, unknown> | undefined,
  ): string {
    for (const [key, value] of Object.entries(params ?? {})) {
      path = path.replace(`:${key}`, encodeURIComponent(String(value)));
    }

    return path;
  }

  private applyApiOrigin(path: string): string {
    const apiOrigin = import.meta.env.PUBLIC_API_ORIGIN ?? "";

    return `${apiOrigin}${path}`;
  }
}
