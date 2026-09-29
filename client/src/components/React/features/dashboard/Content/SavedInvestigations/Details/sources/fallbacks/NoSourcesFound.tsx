export default function NoSourcesFound(): JSX.Element | null {
  return (
    <div className="w-full h-full relative border-t mt-4 border-white/10">
      <h1 className="text-zinc-400 text-xl mt-12 pb-12 font-light tracking-tight">
        No sources could be found for this investigation
      </h1>
    </div>
  );
}
