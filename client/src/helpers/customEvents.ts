export function emitFadeFooter(): void {
    window.dispatchEvent(new Event("footer:fadeout"));
};