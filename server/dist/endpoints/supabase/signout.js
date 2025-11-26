export const signUserOut = async (res) => {
    try {
        res.clearCookie('sb-access-token');
        res.clearCookie('sb-refresh-token');
        res.status(200).json({ message: 'Signed out successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to sign out' });
    }
    ;
};
//# sourceMappingURL=signout.js.map