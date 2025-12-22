const sendResetEmail = async (email: string): Promise<boolean> => {

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

        console.log(result)

        if (result.message === 'Reset email sent.') {
            return true;
        };

    } catch (error) {
        console.error(error);
        return false;
    };
};

export { sendResetEmail };