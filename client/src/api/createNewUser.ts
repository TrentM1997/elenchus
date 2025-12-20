
async function createNewUser(email: string, password: string): Promise<any> {

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

        const result: Response = await response.json();

        return result.status;

    } catch (err) {
        console.error(err);
    }
};

export { createNewUser };