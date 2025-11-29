import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from "express";
const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../../../client/dist');
router.get('*', (req, res) => {
    console.log("SPA fallback hit");
    try {
        const filePath = path.join(clientDistPath, 'index.html');
        res.sendFile(filePath);
    }
    catch (err) {
        if (err.code === 'ECONNRESET') {
            res.status(500).send('Lost Network Connection');
        }
        else {
            res.status(500).send('Internal Error');
        }
    }
});
export { router as spaFallback };
//# sourceMappingURL=spaFallback.js.map