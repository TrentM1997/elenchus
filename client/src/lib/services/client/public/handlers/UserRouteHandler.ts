import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  FeedbackResponseSchema,
  FeedbackResponseSchemaType,
} from "@/lib/schemas/auth/FeedbackSchema";
import {
  ResetPasswordResponseSchema,
  ResetPasswordResponseSchemaType,
} from "@/lib/schemas/auth/AuthSchemas";
import { IHttpClient } from "../../http/types";

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
      ResetPasswordResponseSchema,
      email,
    );
  }

  public async submitFeedback(
    feedback: FeedbackInputType,
  ): Promise<FeedbackResponseSchemaType> {
    return await this.http.post(
      this.routes.user.feedback,
      FeedbackResponseSchema,
      feedback,
    );
  }
}
