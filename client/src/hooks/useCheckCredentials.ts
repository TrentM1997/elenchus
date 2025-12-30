import { useEffect, useState } from "react";
import { emailValidation, requiredInput, confirmPassword } from "@/helpers/formatting/validation";

type CheckStatusType = 'confirmation' | 'n/a';

const useCheckCredentials = (userEmail: string | null, userPassword: string | null, secondPW?: string | null) => {
    const [validEmail, setValidEmail] = useState<boolean>(null)
    const [acceptedInput, setAcceptedInput] = useState<boolean>(null)
    const [checkStatus, setCheckStatus] = useState<CheckStatusType>('n/a');

    useEffect(() => {
        if ((userEmail === "") || (userPassword === "")) return;

        if (userEmail) {
            setValidEmail(emailValidation(userEmail));
        };
        if (userEmail && userPassword) {
            requiredInput(userEmail, userPassword, setAcceptedInput);
        };
    }, [userEmail, userPassword]);

    useEffect(() => {
        if (secondPW) {
            setCheckStatus("confirmation");
        };


        if ((checkStatus === 'confirmation')) {
            const valid = confirmPassword(userPassword, secondPW)
            setAcceptedInput(valid);
        }

    }, [secondPW]);

    return { validEmail, acceptedInput };
};

export { useCheckCredentials }