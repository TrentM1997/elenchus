import DisplayLoader from "../../Shared/Loaders/DisplayLoader";
import AppWindowIcon from "../../Shared/IconComponents/AppWindowIcon";
import DelayedFallback from "../../Shared/fallbacks/DelayedFallback";

export default function Pageskeleton() {

    return (
        <DisplayLoader>
            <AppWindowIcon />
        </DisplayLoader>
    );
};