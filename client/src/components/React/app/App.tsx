import { store } from "@/state/store";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "@/components/React/routing/router/Router";
import { useEffect } from "react";
import { useTooltipFlags } from "@/lib/hooks/rendering/useTooltipFlags";

export interface ExtractionToast {
  shownToast: boolean;
}

export default function App() {
  const { setFlag } = useTooltipFlags();

  useEffect(() => {
    setFlag("readingTooltip", false);
    setFlag("selectingTooltip", false);
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

// const TOASTKEY = 'extraction-toast:v1';
// const storedToast = window.sessionStorage.getItem(TOASTKEY);
// const parsedToast: ExtractionToast | null = JSON.parse(storedToast);
// if (parsedToast) return;
//
// const toast: ExtractionToast = { shownToast: false };

// window.sessionStorage.setItem(TOASTKEY, JSON.stringify(toast));
