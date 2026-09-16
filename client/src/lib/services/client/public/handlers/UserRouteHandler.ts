import {
  PublicServerClientRoutes,
  ServerClientRoutes,
} from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../httpClient";
import {
  FeedbackResponseSchema,
  FeedbackResponseSchemaType,
} from "@/lib/schemas/FeedbackSchema";
import {
  ResetPasswordResponseSchema,
  ResetPasswordResponseSchemaType,
} from "@/lib/schemas/AuthSchemas";

type FeedbackInputType = {
  email: string;
  message: string;
};

export interface IUserRouteHandler {
  submitFeedback(
    payload: FeedbackInputType,
  ): Promise<FeedbackResponseSchemaType>;
  resetPassword(email: string): Promise<ResetPasswordResponseSchemaType>;
}

export class UserRouteHandler implements IUserRouteHandler {
  constructor(
    private readonly routes: Pick<PublicServerClientRoutes, "user">,
    private readonly http: Pick<IHttpClient, "post" | "get">,
  ) {}

  public async resetPassword(
    email: string,
  ): Promise<ResetPasswordResponseSchemaType> {
    return await this.http.post(
      this.routes.user.passwordReset,
      email,
      ResetPasswordResponseSchema,
    );
  }

  public async submitFeedback(
    payload: FeedbackInputType,
  ): Promise<FeedbackResponseSchemaType> {
    return await this.http.post(
      this.routes.user.feedback,
      payload,
      FeedbackResponseSchema,
    );
  }
}
