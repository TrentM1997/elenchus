import { validateInvestigation } from "../../schemas/InvestigationSchema.js";
import { saveInvestigation } from "../../helpers/inserts/saveInvestigation.js";
import { clientErrorResponse, serverErrorResponse, successResponse } from "../../utils/responses.js";
export const saveResearch = async (req, res) => {
    const { investigation } = req.body;
    const { isValid, details } = validateInvestigation(investigation);
    if (!isValid) {
        clientErrorResponse(res, "invalid investigation schema", details, 400);
        return;
    }
    try {
        const result = await saveInvestigation(req, res, investigation);
        if (result.status === 'failed') {
            serverErrorResponse(res);
            return;
        }
        successResponse(res, result.message, result.data);
        return;
    }
    catch (error) {
        console.error('Unexpected server error', error);
        serverErrorResponse(res, "Unexpected error querying supabase", null, 500);
        return;
    }
    ;
};
//# sourceMappingURL=saveResearch.js.map