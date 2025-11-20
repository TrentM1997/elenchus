import { ScaleIcon, SheildIcon } from "./FallbackIcons";
import ChartFallback from "./ChartFallback";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";

export default function ChartFallbackContainer() {
    const integrityMessage = `
    No articles saved —
    bookmark some stories to see your reporting 
    quality snapshot.`;
    const biasMessage = "No articles saved — bookmark some stories to see a breakdown of the biases in your information sources."
    const actionFallback = "Look into a topic";
    const directionLink = "/investigate";


    return (
        <div className="flex flex-col gap-y-24 py-16 opacity-0 animate-fade-in animation-delay-200ms">
            <DelayedFallback>
                <ChartFallback message={biasMessage} actionText={actionFallback} direction={directionLink}>
                    <ScaleIcon />
                </ChartFallback>
                <ChartFallback message={integrityMessage} actionText={actionFallback} direction={directionLink} >
                    <SheildIcon />
                </ChartFallback>
            </DelayedFallback>
        </div>
    )
};