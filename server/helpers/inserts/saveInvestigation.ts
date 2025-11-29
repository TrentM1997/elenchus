import { getUserAndSupabase } from "../../endpoints/supabase/serverClient.js";
import { Request, Response } from "express";
import type { InvestigationSchema } from "../../schemas/InvestigationSchema.js";
import type { SaveInvestigationResponse } from "../../types/types.js";
import { ServerError } from "../../core/errors/ServerError.js";

const saveInvestigation = async (
    req: Request,
    res: Response,
    investigation: InvestigationSchema
): Promise<SaveInvestigationResponse> => {
    const session = await getUserAndSupabase(req, res);
    if (!session) {
        throw new ServerError("User authentication failed");
    };

    const {
        idea,
        initial_perspective,
        premises,
        ending_perspective,
        changed_opinion,
        new_concepts,
        takeaway,
        had_merit,
        sources,
        wikipedia_extracts
    } = investigation;

    const {
        supabase,
        user
    } = session;

    const { id } = user;

    const { data, error } = await supabase
        .from('investigations')
        .upsert([
            {
                idea: idea,
                initial_perspective: initial_perspective,
                premises: premises,
                ending_perspective: ending_perspective,
                changed_opinion: changed_opinion,
                new_concepts: new_concepts,
                takeaway: takeaway,
                had_merit: had_merit,
                user_id: id,
                sources: sources,
                wikipedia_extracts: wikipedia_extracts
            }
        ])
        .select();

    if (error) throw new ServerError("Failed to insert investigation into the database");

    return { data: data };
};


export { saveInvestigation };