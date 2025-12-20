import { useEffect, useRef, useState } from "react";
import { emailValidation, requiredInput, confirmPassword } from "@/helpers/validation";

type CheckStatusType = 'confirmation' | 'n/a';




export const useCheckCredentials = (userEmail: string | null, userPassword: string | null, secondPW?: string | null) => {
    const [validEmail, setValidEmail] = useState<boolean>(null)
    const [acceptedInput, setAcceptedInput] = useState<boolean>(null)
    const [checkStatus, setCheckStatus] = useState<CheckStatusType>('n/a');

    console.log(userEmail, userPassword)


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
            confirmPassword(userPassword, secondPW, setAcceptedInput)
        }

    }, [secondPW])


    return { validEmail, acceptedInput };

};