export function stripVideo(markdown: string): string {
    const hasVideoBlock = /This video file cannot be played|Keyboard Shortcuts|Play\/Pause|Error Code/i.test(markdown);
    if (!hasVideoBlock) return markdown;

    const splitTokens = [
        "This video file cannot be played",
        "Keyboard Shortcuts",
        "Play/Pause",
        "Error Code",
        "Recommended Videos",
        "Left Arrow",
        "Right Arrow",
        "Close",
        "Add Topic",
        "Ask AI",
        "BETA",
        "This is a BETA experience. opt-out here"
    ];

    let cleaned = markdown;

    for (const token of splitTokens) {
        const idx = cleaned.indexOf(token);
        if (idx !== -1) {
            cleaned = cleaned.slice(idx);

            const doubleBreak = cleaned.search(/\n\s*\n/);
            if (doubleBreak !== -1) {
                cleaned = cleaned.slice(doubleBreak).trimStart();
            }
            break;
        }
    }

    if (cleaned.length < 200) {
        return markdown;
    }
    return cleaned;
};
