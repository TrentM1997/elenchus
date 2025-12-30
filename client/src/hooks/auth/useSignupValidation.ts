import { useEffect, useState, useMemo } from "react";
import { confirmFirstPassword, confirmPassword, emailValidation } from "@/helpers/formatting/validation";
import type { ValidationStatus, SignupFields, FieldStatus, SignupValidationHook } from "@/env";

function canSubmitFromStatus(status: FieldStatus): boolean {
    return Object.values(status).every(s => s === 'valid');
}

const DEBOUNCE_TIME: number = 300;

const useSignupValidation = (): SignupValidationHook => {
    const [fieldStatus, setFieldStatus] = useState<FieldStatus>({
        e: 'idle',
        p: 'idle',
        c: 'idle'
    });
    const [fields, setFields] = useState<SignupFields>({
        email: null,
        password: null,
        confirmPw: null
    });
    const canSubmit = useMemo(() => {
        return canSubmitFromStatus(fieldStatus)
    }, [fieldStatus]);

    const setFieldValue = <K extends keyof SignupFields>(
        key: K,
        value: SignupFields[K]
    ) => {
        setFields(prev => ({
            ...prev,
            [key]: value
        }))
    };

    const setStatus = (key: keyof FieldStatus, value: ValidationStatus) => {
        setFieldStatus((prev: FieldStatus) => ({ ...prev, [key]: value }));
    };

    const validateAndSet = (
        key: keyof FieldStatus,
        isValid: boolean
    ) => {
        setStatus(key, isValid ? 'valid' : 'rejected');
    };

    const confirmEmail = (ea: SignupFields["email"]) => {
        validateAndSet('e', emailValidation(ea));
    };

    const confirmPW = (p: SignupFields["password"], cp: SignupFields["confirmPw"]) => {
        const valid = confirmPassword(p, cp);
        setStatus('c', valid ? 'valid' : 'rejected');
    };

    const checkFirstPw = (pw: SignupFields["password"]): void => {
        const valid = confirmFirstPassword(pw);
        setStatus('p', valid ? 'valid' : 'rejected');
    };


    useEffect(() => {
        if (fields.email === null) return;

        const emailtimer = window.setTimeout(() => {
            if (fields.email === "") {
                setStatus('e', 'idle');
                return;
            }
            confirmEmail(fields.email);
        }, DEBOUNCE_TIME);


        return () => {
            clearTimeout(emailtimer);
        }

    }, [fields.email]);

    useEffect(() => {
        if (fields.password === null) return;

        const passwordtimer = window.setTimeout(() => {
            if (fields.password === "") {
                setStatus('p', 'idle');
                return;
            };

            checkFirstPw(fields.password);
        }, DEBOUNCE_TIME)


        return () => clearTimeout(passwordtimer);
    }, [fields.password]);


    useEffect(() => {
        if ((fields.confirmPw === null) || (fieldStatus.e !== 'valid') || (fieldStatus.p !== 'valid')) return;

        const confirmtimer = window.setTimeout(() => {
            if (fields.confirmPw === "") {
                setStatus('c', 'idle');
                return;
            };

            confirmPW(fields.password, fields.confirmPw);
        }, DEBOUNCE_TIME);


        return () => clearTimeout(confirmtimer);
    }, [fields.confirmPw, fieldStatus.e, fieldStatus.p]);


    return {
        fieldStatus,
        canSubmit,
        setFieldValue,
        fields
    };
}

export { useSignupValidation };