import { assertNever } from "@/lib/helpers/asserts/assertNever";
import React, { useCallback, useState } from "react";

export const usePasswordFieldVisibility = () => {
  const [inputVisibility, setInputVisibility] = useState<"show" | "hide">(
    "hide",
  );

  const toggleVisibility = useCallback(() => {
    switch (inputVisibility) {
      case "show": {
        setInputVisibility("hide");
        break;
      }
      case "hide": {
        setInputVisibility("show");
        break;
      }
      default: {
        assertNever(inputVisibility);
      }
    }
  }, [inputVisibility]);

  return {
    toggleVisibility,
    inputVisibility,
  };
};
