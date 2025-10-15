import { store } from '@/ReduxToolKit/store';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/components/React/routing/router/Router'
import Root from '../routing/Root/Root';
import { useEffect } from 'react';

export interface ExtractionToast {
    shownToast: boolean
};

export default function App() {

    useEffect(() => {
        const TOASTKEY = 'extraction-toast:v1';
        const storedToast = window.sessionStorage.getItem(TOASTKEY);
        const parsedToast: ExtractionToast | null = JSON.parse(storedToast);
        if (parsedToast) return;

        const toast: ExtractionToast = { shownToast: false };

        window.sessionStorage.setItem(TOASTKEY, JSON.stringify(toast));

    }, [])

    return (
        <Provider store={store}>
            <RouterProvider router={router}>
                <Root />
            </RouterProvider>
        </Provider>
    );
};