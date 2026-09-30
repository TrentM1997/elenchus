import { useDeleteAccountModalPhases } from "@/lib/hooks/auth/useDeleteAccountModalPhases";
import RenderDeleteAccountPhase from "./RenderDeleteAccountPhase";

const deleteAccountFormContainerStyles = `relative inset-0 z-[910] opacity-0 animate-fade-blur animation-delay-400ms
         md:min-w-96 xl:min-h-80 w-80 flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-6 
        sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center bg-ebony mt-2 
        shadow-inset text-center`;

export default function DeleteUserAccount({}) {
  const { phase, choose } = useDeleteAccountModalPhases();

  return (
    <dialog key="returnToSearch" className={deleteAccountFormContainerStyles}>
      <RenderDeleteAccountPhase phase={phase} choose={choose} />
    </dialog>
  );
}
