import DisplayLoader from "../../global/Loaders/DisplayLoader";
import AppWindowIcon from "../../global/IconComponents/AppWindowIcon";
import DelayedFallback from "../../global/fallbacks/DelayedFallback";

export default function Pageskeleton() {

    return (
        <DisplayLoader>
            <AppWindowIcon />
        </DisplayLoader>
    );
};