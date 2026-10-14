import RouteLink from "../components/links/RouteLink";

type NavigationPath =
  | { title: "Home"; path: "/" }
  | { title: "Investigate"; path: "/Investigate" }
  | { title: "About"; path: "/About" };

type RouteLinkPaths = Array<NavigationPath>;

const navPaths = [
  { title: "Home", path: "/" },
  { title: "Investigate", path: "/Investigate" },
  { title: "About", path: "/About" },
] as const satisfies RouteLinkPaths;

export default function DesktopRouteLinks(): JSX.Element {
  return (
    <ul
      className="space-y-2 w-full justify-self-end justify-end text-md list-none 
    md:space-y-0 text-white md:m-auto inline-flex flex-nowrap md:items-center 
    text-center md:h-8 gap-8"
    >
      {navPaths.map((item) => (
        <RouteLink key={item.title} path={item.path} title={item.title} />
      ))}
    </ul>
  );
}
