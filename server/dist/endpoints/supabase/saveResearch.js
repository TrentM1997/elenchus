import { getUserAndSupabase } from "./serverClient.js";
export const saveResearch = async (req, res) => {
    const session = await getUserAndSupabase(req, res);
    if (!session)
        return;
    const { supabase, user } = session;
    const { investigation } = req.body;
    try {
        const { data, error } = await supabase
            .from('investigations')
            .upsert([
            {
                idea: investigation.idea,
                initial_perspective: investigation.initial_perspective,
                premises: investigation.premises,
                ending_perspective: investigation.ending_perspective,
                changed_opinion: investigation.changed_opinion,
                new_concepts: investigation.new_concepts,
                takeaway: investigation.takeaway,
                had_merit: investigation.had_merit,
                user_id: user.id,
                sources: investigation.sources,
                wikipedia_extracts: investigation.wikipedia_extracts
            }
        ])
            .select();
        if (error) {
            const response = { message: error.message, data: null };
            res.status(400).send(response);
            return;
        }
        else if (data) {
            const response = { message: "Saved research data", data: data };
            res.status(200).send(response);
            return;
        }
        ;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Unexpected error saving research: ${error}`);
            res.status(500).json({ message: "Internal Server Error", data: null });
            return;
        }
        else {
            console.error('Unexpected server error', error);
            res.status(500).json({ message: "Internal Server Error", data: null });
            return;
        }
        ;
    }
    ;
};
//# sourceMappingURL=saveResearch.js.map