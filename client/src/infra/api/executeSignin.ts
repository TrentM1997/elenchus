import type { LoginResponse } from "@/env";
import type { AuthRequestConfig } from "@/transport/types/types";

function createSigninRequest(email: string, password: string, config: AuthRequestConfig): RequestInit {
    return {
        method: 'POST',
        credentials: config.credentials,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        }),
    };
}


function executeSignIn(config: AuthRequestConfig) {
    return async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await fetch(config.endpoint, createSigninRequest(email, password, config));

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const sessionData = await response.json();
            return {
                message: 'success',
                session: sessionData
            }

        } catch (err) {
            console.error("executeSignIn failed:", err);
            return {
                message: err instanceof Error ? err.message : 'failed',
                session: null
            }
        };
    }


}


export { executeSignIn };