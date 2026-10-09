import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInput extends Omit<UseFormRegisterReturn<"password">, "ref"> {
    inputRef: UseFormRegisterReturn<"password">["ref"];
    error?: string;
}

export default function Password({ inputRef, error, ...field }: PasswordInput) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="col-span-full">
            <div className="relative w-full h-auto">
                <label htmlFor="password" className="block mb-3 text-sm font-medium text-white">
                    Password
                </label>
                <input {...field} ref={inputRef} aria-invalid={Boolean(error)} aria-describedby={error ? "password-error" : undefined} id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Type password here..." autoComplete="current-password"
                    className={`block w-full px-3 py-3 border-2 rounded-xl appearance-none text-white placeholder-black/50 bg-white/5 focus:bg-black
                                    focus:outline-none focus:ring-black text-base sm:text-sm placeholder-zinc-500 h-10 relative
                                    ${error ? "focus:border-red-500 border-red-500" : "focus:border-white border-white/5"}`}
                    required />
                <button aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(prev => !prev)} className="w-fit h-fit absolute right-2 bottom-2 z-30 group" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        className={`${showPassword ? 'opacity-100' : 'opacity-60'} icon icon-tabler text-white group-hover:opacity-100 transition-opacity duration-200 ease-in-out icons-tabler-outline icon-tabler-eye`}>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>

                </button>
            </div>
            {error && <p id="password-error" role="alert" className="mt-2 text-sm text-red-400">{error}</p>}

        </div>
    )
}
