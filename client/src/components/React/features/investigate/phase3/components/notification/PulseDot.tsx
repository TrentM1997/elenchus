export default function PulseDot() {
  return (
    <div className="w-auto h-fit relative">
      <div className="flex justify-center">
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full transform-gpu will-change-transform ease-soft animate-ping rounded-full bg-white/80 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-white"></span>
        </span>
      </div>
    </div>
  );
}
