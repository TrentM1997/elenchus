import type { AuthRequestConfig } from "@/transport/types";

export type CreateUserResult =
    | { ok: true }
    | { ok: false };


function createNewUser(config: AuthRequestConfig) {
    return async (email: string, password: string): Promise<CreateUserResult> => {
        try {
            const response = await fetch(config.endpoint, {
                method: 'POST',
                credentials: config.credentials,
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
                throw new Error("Failed to create new user");
            }

            return { ok: true }


        } catch (err) {
            console.error(err);
            return {
                ok: false
            }
        }
    }


};

export { createNewUser };