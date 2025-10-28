export function stripVideo(markdown) {
    const hasVideoBlock = /This video file cannot be played|Keyboard Shortcuts|Play\/Pause|Error Code/i.test(markdown);
    if (!hasVideoBlock)
        return markdown;
    const splitTokens = [
        "This video file cannot be played",
        "Keyboard Shortcuts",
        "Play/Pause",
        "Error Code",
        "Recommended Videos",
        "Left Arrow",
        "Right Arrow"
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
}
;
//# sourceMappingURL=stripVideo.js.map