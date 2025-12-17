import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Static } from '@sinclair/typebox';



function validateSchema<T extends TSchema>(
    schema: T,
    data: unknown
) {
    const validator = TypeCompiler.Compile(schema);

    if (validator.Check(data)) return {
        data: data as Static<T>,
        ok: true
    }

    console.log([...validator.Errors(data)])

    return {
        data: null,
        ok: false,

    };
};

export { validateSchema };