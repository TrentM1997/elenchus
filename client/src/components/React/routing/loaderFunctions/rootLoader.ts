import type { LoaderFunctionArgs } from "react-router-dom";
import { serverClient } from "@/lib/services/client/serverClient";
import { UserKind } from "@/state/Reducers/Athentication/Authentication";

export async function rootLoader({
  request,
}: LoaderFunctionArgs): Promise<UserKind> {
  const result = await serverClient.general.auth.recover();
  return result.status;
}
