export default function ExtractError(): JSX.Element {
  return (
    <div className="w-full h-24 p-2 flex items-center justify-center">
      <div className="w-full h-auto">
        <p className="text-white text-center font-light tracking-tight text-base">
          Couldn't retrieve an extract for the selected term
        </p>
      </div>
    </div>
  );
}
