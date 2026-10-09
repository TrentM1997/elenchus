import type { UseFormRegisterReturn } from "react-hook-form";

interface EmailInput extends Omit<UseFormRegisterReturn<"email">, "ref"> {
  inputRef: UseFormRegisterReturn<"email">["ref"];
  error?: string;
}

export default function Email({ inputRef, error, ...field }: EmailInput) {
  return (
    <div className="col-span-full">
      <label htmlFor="email" className="block mb-3 text-sm font-medium text-white">
        Email
      </label>
      <input
        {...field}
        ref={inputRef}
        id="email"
        type="email"
        autoComplete="username"
        placeholder="email@example.com"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "email-error" : undefined}
        className={`block w-full px-3 py-3 border-2 rounded-xl appearance-none text-white bg-white/5
          focus:bg-transparent focus:outline-none focus:ring-black text-base sm:text-sm placeholder-zinc-500 h-10
          transition-all duration-200 ease-in-out
          ${error ? "border-red-500 focus:border-red-500" : "focus:border-white border-white/5"}`}
        required
      />
      {error && <p id="email-error" role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
