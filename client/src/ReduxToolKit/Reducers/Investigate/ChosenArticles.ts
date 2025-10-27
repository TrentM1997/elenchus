import { createSlice } from '@reduxjs/toolkit'
import { SelectedArticle } from '@/env'


interface ChosenArticles {
    chosenArticles: Array<SelectedArticle> | null,
    showMaxToast: boolean
}

const initialState: ChosenArticles = {
    chosenArticles: [],
    showMaxToast: false
};


//currently using the given index of the article as the splice action.payload value

export const ArticlesSlice = createSlice({
    name: 'chosenArticles',
    initialState: initialState,
    reducers: {
        choose: (state, action) => {
            state.chosenArticles.push(action.payload)
        },
        discard: (state, action) => {
            state.chosenArticles.splice(action.payload, 1)
        },
        openMaxtoast: (state, action) => {
            state.showMaxToast = action.payload;
        },
        clearChosenArticles: () => {
            return initialState
        }
    }
})


export type ChosenArticleSlice = ReturnType<typeof ArticlesSlice.reducer>;


export const { choose, discard, clearChosenArticles, openMaxtoast } = ArticlesSlice.actions

export default ArticlesSlice.reducer




