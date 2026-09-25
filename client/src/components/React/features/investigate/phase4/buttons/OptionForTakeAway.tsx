import { Opt } from "../Stance";

interface OptionButtons {
  chooseOption: (option: Opt) => void;
}

export default function OptionFortakeaway({
  chooseOption,
}: OptionButtons): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-8">
      <header className="w-auto h-auto">
        <h1 className="text-white font-light w-full tracking-tight text-sm 2xl:text-lg ">
          Want to write down any takeways?
        </h1>
      </header>
      <div className="w-auto flex items-center gap-x-2">
        <button
          onClick={() => chooseOption("Opt-in")}
          className="flex items-center relative px-2 text-black hover:text-white
                 xs:w-28 xs:h-9 lg:w-32 lg:h-12 2xl:p-2 2xl:h-12 2xl:w-36 cursor-pointer bg-white hover:bg-white/5 
                rounded-lg transition-all duration-200 ease-inout group text-center
                 "
        >
          Yes
        </button>
        <button
          onClick={() => chooseOption("Opt-out")}
          className="flex items-center relative px-2 text-black hover:text-white
                 xs:w-28 xs:h-9 lg:w-32 lg:h-12 2xl:p-2 2xl:h-12 2xl:w-36 cursor-pointer bg-white hover:bg-white/5 
                rounded-lg transition-all duration-200 ease-inout group text-center
                 "
        >
          No
        </button>
      </div>
    </div>
  );
}
