// 1. Base client to encapsulate standard fetch boilerplate and uniform error handling
class HttpClient {
  constructor(
    private readonly baseUrl: string = import.meta.env.PUBLIC_API_URL || "",
  ) {}

  public async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText} (${res.status})`);
    }

    return res.json() as Promise<T>;
  }
}
