export default function ProceedToFormOrCancel({
  choose,
}: {
  choose: (choice: "initial" | "proceed" | "cancel") => void;
}) {
  return (
    <main aria-label="proceed-or-cancel" className="w-full h-full m-auto">
      <section className="flex flex-col gap-4 items-center justify-center">
        <header className="text-white font-light tracking-tight text-3xl">
          Delete your account?
        </header>
        <sub className="text-white/60 font-light tracking-tight text-lg">
          this action cannot be undone
        </sub>
      </section>

      <div className="inline-flex flex-no-wrap gap-x-8 items-center mt-8 w-full">
        <button
          onClick={() => choose("cancel")}
          type="button"
          className="text-sm py-2 w-full px-4 border focus:ring-2 rounded-full border-transparent bg-white hover:bg-white/10 text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white inline-flex items-center justify-center ring-1 ring-transparent"
        >
          No
        </button>
        <button
          onClick={() => choose("proceed")}
          type="button"
          className="text-sm py-2 w-full px-4 border focus:ring-2 rounded-full border-transparent bg-white hover:bg-white/10 text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white inline-flex items-center justify-center ring-1 ring-transparent"
        >
          Yes
        </button>
      </div>
    </main>
  );
}
