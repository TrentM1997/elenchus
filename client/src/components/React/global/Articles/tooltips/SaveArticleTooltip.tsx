interface TooltipProperties {
  isSaved: boolean | null;
}

export default function SaveArticleTooltip({ isSaved }: TooltipProperties) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-3
        w-max -translate-x-1/2 whitespace-nowrap rounded-md border border-black/20 bg-white px-2 py-1
        text-center text-sm font-light tracking-tight text-black opacity-0 shadow-lg
        transition-opacity duration-150 md:group-hover/bookmark:visible md:group-hover/bookmark:opacity-100"
    >
      {isSaved ? "remove" : "save article"}
      <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-white" />
    </div>
  );
}
