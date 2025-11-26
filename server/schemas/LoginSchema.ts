import { LoginBody } from "../types/types";
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { Static } from '@sinclair/typebox';

export const LoginSchema = Type.Object({
    email: Type.String(),
    password: Type.String()
});

export type LoginSchema = Static<typeof LoginSchema>;

const validator = TypeCompiler.Compile(LoginSchema);

export const validateLoginBody = (loginBody: LoginBody) => {

    const isValid = validator.Check(loginBody);
    const details = isValid ? null : [...validator.Errors(loginBody)];

    return { isValid, details } as const;
};

export type ValidateLoginResp = ReturnType<typeof validateLoginBody>;