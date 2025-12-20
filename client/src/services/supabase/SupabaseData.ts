import { SupabaseUser } from "@/env";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { executeSaveArticleRequest } from "@/api/executeSaveArticle";
import { validateSchema } from "../../../../schemas/api/validation/validateSchema";
import { ArticleSchema } from "../../../../schemas/api/types/ArticlesSchema";
import { CredentialsSchema } from "../../../../schemas/api/types/LoginSchema";
import { executeSignIn } from "@/api/executeSignin";
import { logValidationError } from "@/helpers/errors/logValidationError";
import { createNewUser } from "@/api/createNewUser";
import type { CreateUserResult } from "@/api/createNewUser"

export const supabaseSignIn = async (
    email: string,
    password: string,
): Promise<LoginResponse> => {
    const body = { email: email, password: password };

    try {
        const { data, ok, errors } = validateSchema(CredentialsSchema, body);

        if (!ok) {
            logValidationError(errors);
            throw new Error("Invalid schema submitted by client");
        }

        const { email, password } = data;
        const result = await executeSignIn(email, password);
        return result;

    } catch (error) {
        console.error(error);

        return {
            message: "Failed to signin user",
            session: null
        }
    };
};


export const newUser = async (
    email: string,
    password: string,
): Promise<CreateUserResult> => {
    const body = { email, password }

    try {
        const { data, ok, errors } = validateSchema(CredentialsSchema, body);

        if (!ok) {
            logValidationError(errors);
            throw new Error("Failed to validate email and password schema for new user creation");
        }

        const request = await createNewUser(data.email, data.password);

        return request


    } catch (error) {
        if (error) {
            console.error(error);
            return { ok: false }
        }
    };
};


export const saveArticle = async (
    article: Article,
    exists?: boolean,
): Promise<
    SavedResponse
    | null
> => {

    try {
        const { ok, data, errors } = validateSchema(ArticleSchema, article);

        if (!ok) {
            logValidationError(errors);
            return null;
        }

        const result = await executeSaveArticleRequest(data, exists);
        return result;

    } catch (error) {
        console.error(error);
        return null;
    };
};


export const getInvestigationSources = (sources: string[], savedArticles: Array<Article>) => {
    if (
        !sources
        || !Array.isArray(sources)
        || savedArticles.length === 0
    ) return;

    const sourceSet = new Set(sources);

    return savedArticles.filter((article: Article) => sourceSet.has(article.article_url));

};


export const submitFeedback = async (authorEmail: string, message: string): Promise<boolean> => {

    try {

        const response = await fetch('/sendFeedback', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: authorEmail,
                message: message
            }),
        });

        if (!response.ok) {
            throw new Error(`Couldn't reach the endpoint for feedback: ${response.statusText}`);
        };
        const result = await response.json();

        return result ? true : false;

    } catch (error) {
        console.error(error);
        return false
    };
};


export const pwReset = async (email: string, newPassword: string): Promise<SupabaseUser | null> => {

    try {
        const response = await fetch('/passwordReset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                newPassword: newPassword
            }),
        });

        if (!response.ok) {
            throw new Error(`Unable to reach endpoint: ${response.statusText}`);
        };

        const results: ResetPW = await response.json();
        const user: SupabaseUser = results.data
        return user;

    } catch (error) {
        console.error(error);
        return null;
    };
};


export interface DeleteAccountRes {
    message: 'User deleted successfully.' | 'Invalid Credentials' | 'Email and password are required.' | 'Failed to connect to the database';
}

export const deleteAccount = async (email: string, password: string): Promise<DeleteAccountRes | null> => {
    if (!email || !password) return null;

    try {
        const deletion = await fetch('/deleteUser', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!deletion.ok) {
            throw new Error(`Error fetching endpoint: ${deletion.statusText}`);
        }

        const response = await deletion.json()
        return { message: response.message }

    } catch (error) {
        console.error(error);
        return { message: 'Failed to connect to the database' };
    };
}

