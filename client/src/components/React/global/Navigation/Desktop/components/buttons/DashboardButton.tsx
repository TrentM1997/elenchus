import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function DashboardButton(): JSX.Element {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const location = useLocation();
  const active: boolean =
    location.pathname === "/dashboard" || location.pathname === "/login";

  return (
    <div className="relative block">
      <Link to={userKind === "authenticated" ? "/dashboard" : "/login"}>
        <button
          className="flex flex-nowrap group items-center justify-between 2xl:w-28
                                 2xl:gap-x-2 py-1.5 px-4 rounded-md  bg-gradient-to-tr from-ebony to-mirage shadow-thick border border-white/5
                                 bg-white/5 hover:bg-black hover:border-white/10 transition-all duration-200 ease-in-out w-auto cursor-pointer group"
        >
          <p
            key={`status-${userKind}`}
            className={`
                            ${active ? "text-blue-300" : "text-white"}
                            text-center font-light text-sm w-full
                            group-hover:text-blue-400 transition-colors duration-200 ease-soft
                             whitespace-nowrap
                            `}
          >
            {userKind === "authenticated" ? "Dashboard" : "Log in"}
          </p>
        </button>
      </Link>
    </div>
  );
}
