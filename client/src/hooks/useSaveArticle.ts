import { useCallback, useMemo, useState } from "react";
import { saveArticle } from "@/services/supabase/SupabaseData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { fetchSavedArticles } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";

interface SaveArticleHook {
    handleSaveArticle: () => Promise<void>,
    result: string | null
};

interface SaveHookParams {
    article: Article,
    isSaved: boolean | null
}

export function useSaveArticle({ article, isSaved }: SaveHookParams): SaveArticleHook {
    const [result, setResult] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const activeSession = useSelector((state: RootState) => state.auth.activeSession);
    const userArticles = useSelector((state: RootState) => state.userdata.userArticles);

    const dbId = useMemo(() => {
        const saved = Array.isArray(userArticles)
            ? userArticles.find(a => a.article_url === article.article_url)
            : undefined;
        return saved?.id ?? null;
    }, [userArticles, article.article_url]);


    const dataToSave: Article = useMemo(() => {
        let auth: string | string[]
        if (typeof article.authors === 'string') {
            auth = [];
            auth.push(article.authors);
        } else {
            auth = article.authors;
        };

        return {
            title: article.title,
            provider: article.provider,
            image_url: article.image_url,
            full_text: article.full_text,
            authors: auth,
            date_published: article.date_published ? article.date_published : article.fallbackDate,
            article_url: article.article_url,
            summary: article.summary,
            fallbackDate: article.fallbackDate,
            id: dbId,
            factual_reporting: article.factual_reporting,
            bias: article.bias,
            country: article.country
        };
    }, [
        article.title,
        article.provider,
        article.image_url,
        article.full_text,
        article.authors,
        article.date_published,
        article.fallbackDate,
        article.article_url,
        article.summary,
        article.factual_reporting,
        article.bias,
        article.country,
        dbId,
    ]);


    const handleSaveArticle = useCallback(async (): Promise<void> => {
        if (!activeSession) {
            setResult("Login or join to save articles");
            return;
        };

        try {
            const resp: SavedResponse | null = await saveArticle(dataToSave, isSaved);
            setResult(resp?.message ?? null);
            dispatch(fetchSavedArticles());

        } catch (error) {
            console.error(error);
        };

    }, [dispatch, dataToSave, isSaved]);

    return { handleSaveArticle, result };
};