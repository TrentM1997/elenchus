import { useDeleteAccountForm } from "@/lib/hooks/auth/useDeleteAccountForm";
import { usePasswordFieldVisibility } from "@/lib/hooks/auth/usePasswordFieldVisibility";

const inputStyles =
  "block h-11 w-full rounded-xl border border-white/20 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-500 transition-colors duration-200 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50";

export default function DeleteAccountForm() {
  const { getInput, credentials, submit, submission, validationStatus } =
    useDeleteAccountForm();
  const { toggleVisibility, inputVisibility } = usePasswordFieldVisibility();

  return (
    <form
      className="w-full min-w-0 space-y-6 text-left"
      aria-busy={submission === "pending"}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white"
        >
          Email
        </label>
        <input
          onChange={(e) => getInput(e, "email")}
          value={credentials.email}
          disabled={submission === "pending"}
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="example@email.com"
          className={inputStyles}
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white"
        >
          Password
        </label>
        <div className="relative">
          <input
            onChange={(e) => getInput(e, "password")}
            value={credentials.password}
            disabled={submission === "pending"}
            id="password"
            name="password"
            type={inputVisibility === "hide" ? "password" : "text"}
            autoComplete="off"
            placeholder="type password here"
            className={`${inputStyles} pr-12`}
            required
          />
          <button
            onClick={() => toggleVisibility()}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60"
            type="button"
            aria-label={inputVisibility === "hide" ? "Show password" : "Hide password"}
            aria-pressed={inputVisibility === "show"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={inputVisibility === "show" ? "text-white" : ""}
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
            </svg>
          </button>
          </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={validationStatus !== "valid" || submission === "pending"}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-100 bg-white px-4 py-2 text-sm font-medium text-black transition-colors duration-200 enabled:hover:bg-white/10 enabled:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ebony disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submission === "pending" ? "Deleting account…" : "Delete Account"}
        </button>
      </div>
    </form>
  );
}
