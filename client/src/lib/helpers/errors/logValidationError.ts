import type { ValidationErrors } from "../../../../schemas/api/validation/validateSchema";

function logValidationError(errors: ValidationErrors): void {

    for (const error of errors) {
        console.error(`
                    -Path ${error.path}, 
                    Message: ${error.message}, 
                    Recieved Value: ${error.value}
                    `);
    };
}

export { logValidationError };