;
export const deleteArticleForUser = async (supabase, user_id, id) => {
    try {
        const response = await supabase
            .from('articles')
            .delete()
            .eq('user_id', user_id)
            .eq('id', id)
            .select();
        if (response?.error) {
            console.error('Deleting error', response.error.message);
            return null;
        }
        else if (response) {
            const message = "Deleted";
            console.log(response);
            return { message: message, id: null };
        }
        ;
        return null;
    }
    catch (error) {
        console.log(error);
        const err_message = error instanceof Error
            ? `Unknown server error: ${error.message}`
            : 'Unknown server error, check server logs for more info';
        return { message: err_message, id: null };
    }
    ;
};
//# sourceMappingURL=deleteArticle.js.map