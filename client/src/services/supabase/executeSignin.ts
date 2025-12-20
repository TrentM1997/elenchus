import type { LoginResponse } from "@/env";

function createSigninRequest(email: string, password: string): RequestInit {
    return {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        }),
    };
}


async function executeSignIn(email: string, password: string): Promise<LoginResponse> {

    try {
        const response = await fetch('/supabaseLogIn', createSigninRequest(email, password));

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const sessionData = await response.json();
        return {
            message: 'success',
            session: sessionData
        }

    } catch (err) {
        console.error(err);
        return {
            message: 'failed',
            session: null
        }
    };
}


export { executeSignIn };