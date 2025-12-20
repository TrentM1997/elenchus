export type CreateUserResult =
    | { ok: true }
    | { ok: false };


async function createNewUser(email: string, password: string): Promise<CreateUserResult> {

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
            throw new Error("Failed to create new user");
        }

        return { ok: true }


    } catch (err) {
        console.error(err);
        return {
            ok: false
        }
    }
};

export { createNewUser };