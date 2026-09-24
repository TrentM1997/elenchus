import type { PublicApiContract } from "@elenchus/contracts";
import { FeedbackResponseSchemaType } from "@elenchus/contracts/schemas/auth/FeedbackSchema";
import { ResetPasswordResponseSchemaType } from "@elenchus/contracts/schemas/auth/AuthSchemas";
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
    private readonly routes: Pick<PublicApiContract, "user">,
    private readonly http: Pick<IHttpClient, "request">,
  ) {}

  public async resetPassword(
    email: string,
  ): Promise<ResetPasswordResponseSchemaType> {
    const route = this.routes.user.passwordReset;

    return await this.http.request(route, { body: { email } });
  }

  public async submitFeedback(
    feedback: FeedbackInputType,
  ): Promise<FeedbackResponseSchemaType> {
    const route = this.routes.user.feedback;

    return await this.http.request(route, { body: { feedback } });
  }
}
