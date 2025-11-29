import { saveInvestigation } from "../../../../helpers/inserts/saveInvestigation.js";
import { validateOrThrow } from "../../../../core/validation/validateOrThrow.js";
import { wrapAsync } from "../../../../core/async/wrapAsync.js";
import { InvestigationSchema } from "../../../../schemas/InvestigationSchema.js";
export const saveResearch = wrapAsync(async (req, res) => {
    const investigation = validateOrThrow(InvestigationSchema, req.body.investigation);
    const result = await saveInvestigation(req, res, investigation);
    res.success("investigation saved", result?.data);
});
//# sourceMappingURL=saveResearch.js.map