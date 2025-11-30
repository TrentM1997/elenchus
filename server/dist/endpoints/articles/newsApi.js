import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { wrapAsync } from '../../core/async/wrapAsync.js';
import { validateOrThrow } from '../../core/validation/validateOrThrow.js';
import { SearchQuerySchema } from '../../schemas/SearchQuerySchema.js';
import { queryNewsApi } from '../../services/newsapi/queryNewsApi.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
const newsApi = wrapAsync(async (req, res) => {
    const q = validateOrThrow(SearchQuerySchema, req.query.q);
    const query = decodeURIComponent(q);
    const results = await queryNewsApi(query);
    res.success("successful search", results, 200);
});
export { newsApi };
//# sourceMappingURL=newsApi.js.map