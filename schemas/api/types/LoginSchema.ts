import {
    Type,
    Static
} from "@sinclair/typebox"

const CredentialsSchema = Type.Object({
    email: Type.String(),
    password: Type.String()
});

type CredentialsSchemaType = Static<typeof CredentialsSchema>;


export { CredentialsSchema };

export type { CredentialsSchemaType };


