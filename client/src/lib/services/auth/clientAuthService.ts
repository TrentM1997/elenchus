import { AuthRequestConfig } from "@/infra/transport/types/types";

export type LoginCredentials = { email: string; password: string };

export type LoginResult = { ok: true } | { ok: false; error: string };

export type LoginParams = {
  input: LoginCredentials;
  config: AuthRequestConfig;
};

export interface IClientAuthService {
  login(params: LoginParams): Promise<LoginResult>;
  logOut(
    config: AuthRequestConfig,
  ): Promise<{ ok: true } | { ok: false; error: string }>;
}

export class ClientAuthService implements IClientAuthService {
  public async login(params: LoginParams): Promise<LoginResult> {
    return await this.executeLogin(params);
  }

  public async logOut(
    config: AuthRequestConfig,
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    return await this.executeLogOut(config);
  }

  private async executeLogOut(
    config: AuthRequestConfig,
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
      const request = await fetch(
        config.endpoint,
        this.setLogOutOptions(config),
      );

      if (!request.ok) {
        throw new Error(`Logout request failed: ${request.statusText}`);
      }

      return {
        ok: true,
      };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        error: "Unexpected server error: Log out request failed",
      };
    }
  }

  private async executeLogin(params: LoginParams): Promise<LoginResult> {
    try {
      const response = await fetch(
        params.config.endpoint,
        this.setLoginOptions(params),
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return {
        ok: true,
      };
    } catch (err) {
      console.error(err);
      return {
        ok: false,
        error: "Login request failed",
      };
    }
  }

  private setLogOutOptions(config: AuthRequestConfig): {
    method: "POST";
    credentials: AuthRequestConfig["credentials"];
    headers: {
      "Content-Type": "application/json";
    };
  } {
    return {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  private setLoginOptions(params: LoginParams) {
    const {
      config,
      input: { email, password },
    } = params;

    return {
      method: "POST",
      credentials: config.credentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    };
  }
}
