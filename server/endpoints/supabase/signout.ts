import { Response } from "express";


export const signUserOut = async (res: Response): Promise<void> => {
    try {
        res.clearCookie('sb-access-token');
        res.clearCookie('sb-refresh-token');
        res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to sign out' });
    };
};