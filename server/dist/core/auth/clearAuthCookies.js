async function clearAuthCookies(res) {
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
}
;
export { clearAuthCookies };
//# sourceMappingURL=clearAuthCookies.js.map