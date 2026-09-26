import { LoginCredentialsSchemaType } from "@elenchus/contracts/schemas/auth/AuthSchemas";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import {
  AccountDeletionResult,
  CreateUserResult,
  RequestPasswordResetResult,
} from "../../../db/access/repositories/user/userWriteHandler.ts";
import { FeedbackReqSchemaType } from "@elenchus/contracts/schemas/auth/FeedbackSchema";
import { FeedbackSubmitResult } from "../../../db/access/repositories/feedback/feedbackRespository.ts";
import { ResetPasswordResponseSchemaType } from "@elenchus/contracts/schemas/auth/ResetPasswordSchema";

export interface IUserAccountHandler {
  changePassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType>;
  deleteAccount(
    user_id: string | null | undefined,
    credentials: LoginCredentialsSchemaType,
  ): Promise<AccountDeletionResult>;
  signUp(credentials: LoginCredentialsSchemaType): Promise<CreateUserResult>;
  requestPasswordReset(email: string): Promise<RequestPasswordResetResult>;

  submitFeedback(
    feedback: FeedbackReqSchemaType,
  ): Promise<FeedbackSubmitResult>;
}

export class UserAccountHandler implements IUserAccountHandler {
  constructor(
    private readonly db: Pick<IDbClient, "user" | "feedback">,
    private readonly policy: IAuthorization,
  ) {}

  public async changePassword(credentials: {
    email: string;
    password: string;
  }): Promise<ResetPasswordResponseSchemaType> {
    return await this.db.user.write.resetPassword(credentials);
  }

  public async submitFeedback(
    feedback: FeedbackReqSchemaType,
  ): Promise<FeedbackSubmitResult> {
    return await this.db.feedback.submit(feedback);
  }

  public async signUp(
    credentials: LoginCredentialsSchemaType,
  ): Promise<CreateUserResult> {
    return await this.db.user.write.createUser(credentials);
  }

  public async deleteAccount(
    user_id: string | null | undefined,
    credentials: LoginCredentialsSchemaType,
  ): Promise<AccountDeletionResult> {
    return await this.executeDeleteAccount(user_id, credentials);
  }

  private async executeDeleteAccount(
    user_id: string | null | undefined,
    credentials: LoginCredentialsSchemaType,
  ): Promise<AccountDeletionResult> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.user.write.deleteAccount(userId, credentials);
  }

  public async requestPasswordReset(
    email: string,
  ): Promise<RequestPasswordResetResult> {
    return await this.db.user.write.requestPasswordReset(email);
  }
}
