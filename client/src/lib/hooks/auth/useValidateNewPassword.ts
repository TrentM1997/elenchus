import { useEffect, useState, useMemo } from "react";
import { confirmFirstPassword, confirmPassword } from "@/lib/helpers/formatting/validation";
import type { ValidationStatus } from "@/env";

function canSubmitFromStatus(status: NewPasswordStatus): boolean {
    return Object.values(status).every(s => s === 'valid');
}

type NewPWFields = {
    password: string,
    confirmPassword: string
}

export type NewPasswordStatus = {
    p: ValidationStatus,
    c: ValidationStatus
}

export type ValidateNewPasswordHook = {
    fieldStatus: NewPasswordStatus,
    canSubmit: boolean,
    setFieldValue: (key: keyof NewPWFields, value: string) => void,
    fields: NewPWFields
}

const DEBOUNCE_TIME: number = 300;

const useValidateNewPassword = (): ValidateNewPasswordHook => {
    const [fieldStatus, setFieldStatus] = useState<NewPasswordStatus>({
        p: 'idle',
        c: 'idle'
    });

    const [fields, setFields] = useState<NewPWFields>({
        password: null,
        confirmPassword: null
    });

    const canSubmit = useMemo(() => {
        return canSubmitFromStatus(fieldStatus)
    }, [fieldStatus]);

    const setFieldValue = <K extends keyof NewPWFields>(
        key: K,
        value: NewPWFields[K]
    ) => {
        setFields(prev => ({
            ...prev,
            [key]: value
        }))
    };

    const setStatus = (key: keyof NewPasswordStatus, value: ValidationStatus) => {
        setFieldStatus((prev) => ({ ...prev, [key]: value }));
    };

    const validateAndSet = (
        key: keyof NewPasswordStatus,
        isValid: boolean
    ) => {
        setStatus(key, isValid ? 'valid' : 'rejected');
    };


    const confirmPW = (p: NewPWFields["password"], cp: NewPWFields["confirmPassword"]) => {
        const valid = confirmPassword(p, cp);
        setStatus('c', valid ? 'valid' : 'rejected');
    };

    const checkFirstPw = (pw: NewPWFields["password"]): void => {
        validateAndSet("p", confirmFirstPassword(pw));
    };

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
        if ((fields.confirmPassword === null) || (fieldStatus.p !== 'valid')) return;

        const confirmtimer = window.setTimeout(() => {
            if (fields.confirmPassword === "") {
                setStatus('c', 'idle');
                return;
            };

            confirmPW(fields.password, fields.confirmPassword);
        }, DEBOUNCE_TIME);


        return () => clearTimeout(confirmtimer);
    }, [fields.confirmPassword, fieldStatus.p]);


    return {
        fieldStatus,
        canSubmit,
        setFieldValue,
        fields
    };
}

export { useValidateNewPassword };