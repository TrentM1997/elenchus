import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Static } from '@sinclair/typebox';

function validateSchema<T extends TSchema>(
    schema: T,
    data: unknown
) {
    const validator = TypeCompiler.Compile(schema);

    const valid = validator.Check(data);

    return {
        ok: valid,
        data: valid
            ? data as Static<T>
            : null,
        errors: [...validator.Errors(data)]
    } as const

};

export { validateSchema };