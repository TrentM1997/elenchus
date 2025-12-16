import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const envUrl = fileURLToPath(import.meta.url);
const __dirname = path.dirname(envUrl);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
import { wrapAsync } from '../../../core/async/wrapAsync.js';
import { validateOrThrow } from '../../../core/validation/validateOrThrow.js';
import { FeedbackReqSchema } from '../../../schemas/FeedbackReqSchema.js';
import { submitFeedback } from '../../../services/supabase/submitFeedback.js';
export const sendFeedback = wrapAsync(async (req, res) => {
    const requestData = validateOrThrow(FeedbackReqSchema, req.body);
    const { email, message } = requestData;
    const result = await submitFeedback(email, message);
    res.success("success sending feedback", result.data, 200);
});
//# sourceMappingURL=sendFeedback.js.map