import useMediaQuery from "@/lib/hooks/rendering/useMediaQuery";
import React from "react";
import { renderNav } from "./switches/renderNav";

function Navigation() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return <>{renderNav(isDesktop)}</>;
}

export default React.memo(Navigation);
