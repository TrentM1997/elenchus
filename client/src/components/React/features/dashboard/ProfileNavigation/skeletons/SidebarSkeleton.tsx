export default function SidebarSkeleton() {
    return (
        <aside
            id="sidebar-loader"
            className="relative md:left-0 w-full md:w-44 xl:w-52 h-full transition-transform sm:translate-x-0 bg-[#212123]  border-r border-white/10 overflow-y-auto"
        >
            <div className="space-y-4 px-3 py-16 opacity-0 animate-fade-in transition-opacity">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 w-3/4 rounded transform-gpu will-change-transform animate-shimmer bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)]" />
                ))}
            </div>

        </aside>
    );
};
