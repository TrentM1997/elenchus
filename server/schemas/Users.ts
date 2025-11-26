import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { Static } from '@sinclair/typebox';

export const UserSchema = Type.Object({
    id: Type.String(),
    app_metadata: Type.Any(),
    user_metadata: Type.Any(),

    aud: Type.String(),

    confirmation_sent_at: Type.Optional(Type.String()),
    recovery_sent_at: Type.Optional(Type.String()),
    email_change_sent_at: Type.Optional(Type.String()),

    new_email: Type.Optional(Type.String()),
    new_phone: Type.Optional(Type.String()),

    invited_at: Type.Optional(Type.String()),
    action_link: Type.Optional(Type.String()),

    email: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String()),

    created_at: Type.String(),
    confirmed_at: Type.Optional(Type.String()),
    email_confirmed_at: Type.Optional(Type.String()),
    phone_confirmed_at: Type.Optional(Type.String()),

    last_sign_in_at: Type.Optional(Type.String()),

    role: Type.Optional(Type.String()),
    updated_at: Type.Optional(Type.String()),

    identities: Type.Optional(Type.Array(Type.Any())),
    is_anonymous: Type.Optional(Type.Boolean()),
    is_sso_user: Type.Optional(Type.Boolean()),

    factors: Type.Optional(Type.Array(Type.Any())),
});

export type User = Static<typeof UserSchema>;

const validator = TypeCompiler.Compile(UserSchema);


export const validateUser = (user: User) => {
    const isValid = validator.Check(user);
    const details = isValid ? null : [...validator.Errors(user)]
    return { isValid, details } as const;
};

export type ValidateUserResp = ReturnType<typeof validateUser>;
