import Email from "../InputFields/Email";
import Password from "../InputFields/Password";
import AuthFooterLinks from "../InputFields/AuthFooterLinks";
import { useLoginForm } from "@/lib/hooks/auth/useLoginForm";

export default function LoginForm() {
  const { fields, errors, pending, login } = useLoginForm();

  return (
    <form onSubmit={login} noValidate aria-busy={pending}>
      <Email {...fields.email} error={errors.email?.message} />
      <div className="space-y-6">
        <Password {...fields.password} error={errors.password?.message} />
        <div className="col-span-full">
          <button
            disabled={pending}
            type="submit"
            className="text-sm py-2 px-4 border focus:ring-2 h-10 rounded-full border-zinc-100
                            bg-white hover:bg-black text-black duration-200 focus:ring-offset-2
                            focus:ring-white hover:text-white w-full inline-flex items-center
                            justify-center ring-1 ring-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Logging in…" : "Submit"}
          </button>
        </div>
        <AuthFooterLinks />
      </div>
    </form>
  );
}
