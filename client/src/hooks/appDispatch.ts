import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";

export const useAppdispatch = () => useDispatch<AppDispatch>()