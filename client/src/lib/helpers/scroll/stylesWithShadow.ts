import { CSSProperties } from "react";

export function stylesWithShadow(shadow: string): CSSProperties {
  const boxShadow = shadow;
  return {
    height: "94.5%",
    width: "100%",
    boxShadow: boxShadow,
  };
}
