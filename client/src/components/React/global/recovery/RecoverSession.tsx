import { useRecoverSession } from "@/hooks/recovery/useRecoverSession";
import React from "react";

function RecoverSession({ children }: { children: React.ReactNode }) {
    useRecoverSession();

    return children;
};

export default RecoverSession;