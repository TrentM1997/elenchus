import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { ClientError } from '../errors/ClientError.js';
import { Static } from '@sinclair/typebox';

function validateOrThrow<T extends TSchema>(
    schema: T,
    data: unknown
) {
    const validator = TypeCompiler.Compile(schema);

    const isValid = validator.Check(data);

    if (!isValid) {
        const details = [...validator.Errors(data)];

        throw new ClientError("Invalid Schema", details, 400);
    }

    return data as Static<T>;
};

export { validateOrThrow };