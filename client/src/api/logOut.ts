
export const logOut = async (): Promise<SignOutResponse> => {

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