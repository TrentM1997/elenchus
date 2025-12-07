import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { wrapAsync } from '../../../../core/async/wrapAsync.js';
import { validateOrThrow } from '../../../../core/validation/validateOrThrow.js';
import { ChangePasswordSchema } from '../../../../schemas/Users.js';
import { executePasswordUpdate } from '../../../../services/supabase/updateUserPassword.js';
export const changePassword = wrapAsync(async (req, res) => {
    const body = validateOrThrow(ChangePasswordSchema, req.body);
    const result = await executePasswordUpdate(req, body);
    res.success("password updated successfully", {
        message: 'success',
        data: result
    });
});
//# sourceMappingURL=changePassword.js.map