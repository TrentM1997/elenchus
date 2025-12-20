import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Static } from '@sinclair/typebox';
import type { ValueError } from "@sinclair/typebox/compiler";


export type ValidationErrors = readonly ValueError[];

type ValidateSchemaResp<T extends TSchema> =
    | {
        ok: true;
        data: Static<T>;
        errors: ValidationErrors;
    }
    | {
        ok: false;
        data: null;
        errors: ValidationErrors;
    };



function validateSchema<T extends TSchema>(
    schema: T,
    data: unknown
): ValidateSchemaResp<T> {
    const validator = TypeCompiler.Compile(schema);

    const valid = validator.Check(data);


    if (valid) {
        return {
            ok: true,
            data: data as Static<T>,
            errors: []
        };
    }

    return {
        ok: false,
        data: null,
        errors: [...validator.Errors(data)]
    };
};

export { validateSchema };