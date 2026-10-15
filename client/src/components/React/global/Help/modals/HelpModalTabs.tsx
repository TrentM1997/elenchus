export default function HelpModalTabs({
  activeTab,
  info,
  setActiveTab,
}: HelpModal) {
  const selectedTab =
    activeTab === "tabTwo" && "tabTwo" in info ? "tabTwo" : "tabOne";

  return (
    <ul className="flex flex-wrap items-stretch gap-2">
      {(["tabOne", "tabTwo"] as const).map((tab) => {
        const element =
          tab === "tabOne"
            ? info.tabOne
            : "tabTwo" in info
              ? info.tabTwo
              : undefined;
        if (!element) return null;
        return (
          <li
            className="min-w-0 cursor-pointer"
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            <h1
              className={`h-full rounded-xl border px-3.5 py-2.5 text-sm font-medium leading-snug transition-colors duration-200 sm:text-base 
                      ${
                        tab === selectedTab
                          ? "border-sky-300/25 bg-sky-300/10 text-sky-100"
                          : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                      }`}
            >
              {element.heading}
            </h1>
          </li>
        );
      })}
    </ul>
  );
}
