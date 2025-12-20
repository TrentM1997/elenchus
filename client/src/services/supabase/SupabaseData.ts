import { SupabaseUser } from "@/env";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { executeSaveArticleRequest } from "./executeSaveArticle";
import { validateSchema } from "../../../../schemas/api/validation/validateSchema";
import { ArticleSchema } from "../../../../schemas/api/types/ArticlesSchema";
import { CredentialsSchema } from "../../../../schemas/api/types/LoginSchema";
import { executeSignIn } from "./executeSignin";
import { logValidationError } from "@/helpers/errors/logValidationError";

export const supabaseSignIn = async (
    email: string,
    password: string,
): Promise<LoginResponse> => {

    try {

        const { data, ok, errors } = validateSchema(CredentialsSchema, { email, password });

        console.log({
            schema: data,
            ok: ok,
            errors: errors ?? null
        })

        if (!ok) {
            logValidationError(errors);
            throw new Error("Invalid schema submitted by client");
        }

        const result = await executeSignIn(data.email, data.password);

        return result;

    } catch (error) {
        console.error(error);

        return {
            message: "Failed to signin user",
            session: null
        }
    };
};


export const fetchSignOut = async (): Promise<SignOutResponse> => {

    try {
        const response = await fetch('/signUserOut', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Could not reach endpoint for signout');
        }
        const result = await response.json();
        const message = { loggedOut: true, data: result };
        return message;

    } catch (error) {
        console.error(error);
        const error_message = { loggedOut: false, data: null };
        return error_message;
    };
};



export const sendEmailResetLink = async (email: string): Promise<boolean> => {

    try {

        const response = await fetch('/resetUserPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        if (!response.ok) {
            throw new Error('could not connect to password reset endpoint');
        };

        const result = await response.json();

        if (result.message === 'Reset email sent.') {
            return true;
        };

    } catch (error) {
        console.error(error);
        return false;
    };
};



export const newUser = async (
    email: string,
    password: string,
    setCreatedUser: any,
    setAcceptedInput: any,
    setValidFirstPassword: any,
    setErrorMessage: any,
    setCanSubmit: any): Promise<any> => {

    try {

        const response = await fetch('/createNewUser', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        }
        );

        if (!response.ok) {
            console.log(response.statusText);
            setErrorMessage(response.statusText);
            setCreatedUser(false)
            throw new Error(`Couldn't reach createNewUser Endpoint: ${response.statusText}`);
        };

        const session = await response.json();

        if (session) {
            console.log(session.data);
            setCreatedUser(true);
            setCanSubmit(null);
            setAcceptedInput(null);
            setValidFirstPassword(null);
            setErrorMessage(null);
            return { user: session.data };
        };

    } catch (error) {
        if (error) {
            console.error(error);
            return null
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
            console.error("Invalid Schema submitted to saveArticles()", errors);
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

