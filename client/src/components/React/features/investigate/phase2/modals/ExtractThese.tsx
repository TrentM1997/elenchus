interface ExtractThese {
  executeExtraction: () => Promise<void>;
  dontExecute: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ExtractThese({
  executeExtraction,
  dontExecute,
}: ExtractThese): JSX.Element {
  return (
    <div className="flex gap-x-2 py-4 items-center justify-center h-full w-full">
      <button
        onClick={executeExtraction}
        type="button"
        className="text-base min-w-36 md:w-52 py-2 px-4 rounded-full shadow-material 
                 bg-white hover:bg-white/15 text-black duration-200 
                    hover:text-white inline-flex items-center justify-center"
      >
        Yes
      </button>
      <button
        onClick={(e) => dontExecute(e)}
        type="button"
        className="text-base py-2 min-w-36 md:w-52 px-4 rounded-full shadow-material
                     bg-white hover:bg-white/15 text-black duration-200 
                     hover:text-white inline-flex items-center justify-center"
      >
        No
      </button>
    </div>
  );
}

export function GetArticlesHeader(): JSX.Element {
  return (
    <header className="w-full flex justify-center h-auto">
      <h1
        className="text-white text-lg xl:text-3xl font-light 
                    tracking-tight text-center py-2 w-full"
      >
        Get these articles?
      </h1>
    </header>
  );
}
