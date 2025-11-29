const mapped = (articles) => {
    const hash = new Map(articles.map((article) => [article.id, article]));
    return hash;
};
async function UserArticles(supabase, id) {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select("*")
            .eq('user_id', id)
            .order('id', { ascending: false });
        if (error) {
            console.error(error.message);
            return null;
        }
        else {
            const articleMap = mapped(data);
            return {
                articles: data,
                articleMap: articleMap
            };
        }
        ;
    }
    catch (error) {
        if (error instanceof Error) {
            const err_message = `Unexpected server error: ${error.message}`;
            console.error(err_message);
            return null;
        }
        else {
            console.error(error);
            return null;
        }
        ;
    }
    ;
}
;
async function UserInvestigations(supabase, id) {
    try {
        const { data, error } = await supabase
            .from('investigations')
            .select()
            .eq('user_id', id)
            .order('id', { ascending: false });
        if (error) {
            console.error(error.message);
            return null;
        }
        else {
            return data;
        }
        ;
    }
    catch (error) {
        const error_message = error instanceof Error
            ? `Unknown server error: ${error.message}`
            : 'Unknown server error, check server logs for more info';
        console.error(error_message);
        return null;
    }
    ;
}
export async function getUserContent(supabase, id) {
    try {
        const [articles, investigations] = await Promise.all([
            UserArticles(supabase, id),
            UserInvestigations(supabase, id)
        ]);
        const results = { userArticles: articles, userResearch: investigations };
        return results;
    }
    catch (error) {
        const error_message = error instanceof Error
            ? `Unknown server error: ${error.message}`
            : 'Unknown server error, check server logs for more info';
        console.error(error_message);
        throw error_message;
    }
    ;
}
;
//# sourceMappingURL=getUserContent.js.map