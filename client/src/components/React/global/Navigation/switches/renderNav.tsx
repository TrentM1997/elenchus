import MobileMenu from "@/components/React/Shared/Navigation/Mobile/MobileMenu";
import DeskTopMenu from "@/components/React/Shared/Navigation/Desktop/containers/DeskTopMenu";

export const renderNav = (isDesktop: boolean): JSX.Element | null => {

    switch (isDesktop) {
        case true:
            return (
                <DeskTopMenu key={'desktop-nav'} />
            );
        case false:
            return (
                <MobileMenu key={'mobile-nav'} />
            );

        default: {
            const exhaustive: never = isDesktop;
            return null;
        };
    };
};