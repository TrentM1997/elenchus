function setAuthCookies(session, res) {
    const { access_token, refresh_token } = session;
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('sb-access-token', access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
    });
    res.cookie('sb-refresh-token', refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}
;
export { setAuthCookies };
//# sourceMappingURL=setAuthCookies.js.map