import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
export const LoginSchema = Type.Object({
    email: Type.String(),
    password: Type.String()
});
const validator = TypeCompiler.Compile(LoginSchema);
export const validateLoginBody = (loginBody) => {
    const isValid = validator.Check(loginBody);
    const details = isValid ? null : [...validator.Errors(loginBody)];
    return { isValid, details };
};
//# sourceMappingURL=LoginSchema.js.map