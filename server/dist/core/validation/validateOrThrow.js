import { TypeCompiler } from '@sinclair/typebox/compiler';
import { ClientError } from '../errors/ClientError.js';
function validateOrThrow(schema, data) {
    const validator = TypeCompiler.Compile(schema);
    const isValid = validator.Check(data);
    if (!isValid) {
        const details = [...validator.Errors(data)];
        throw new ClientError("Invalid Schema", details, 400);
    }
    return data;
}
;
export { validateOrThrow };
//# sourceMappingURL=validateOrThrow.js.map