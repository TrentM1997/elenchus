import { getUserAndSupabase } from "../../endpoints/supabase/serverClient.js";
const saveInvestigation = async (req, res, investigation) => {
    const session = await getUserAndSupabase(req, res);
    if (!session)
        return { status: 'failed', message: 'user authentication failed', data: null };
    const { idea, initial_perspective, premises, ending_perspective, changed_opinion, new_concepts, takeaway, had_merit, sources, wikipedia_extracts } = investigation;
    const { supabase, user } = session;
    const { id } = user;
    try {
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
        if (error) {
            throw new Error(`Unexpected error inserting investigation into table 'investigations': ${error}`);
        }
        ;
        return {
            status: 'success',
            message: 'investigation saved',
            data: data
        };
    }
    catch (err) {
        console.error(err);
        return {
            status: 'failed',
            message: 'issue inserting investigation into table',
            data: null
        };
    }
};
export { saveInvestigation };
//# sourceMappingURL=saveInvestigation.js.map