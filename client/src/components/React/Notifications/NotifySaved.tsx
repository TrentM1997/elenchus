import { motion } from "framer-motion"
import { useEffect } from "react"


export default function NotifySavedArticle({ setShowNotification, notification }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, []);

    const variants = {
        closed: {
            opacity: 0,
            scale: 0,
        },
        open: {
            opacity: 1,
            scale: 1

        }
    }

    return (
        <motion.div
            key='actionNotified'
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute z-50 xl:right-8 bottom-0 right-8 bg-white rounded-lg h-auto w-auto flex flex-col items-center
            border border-astro_gray shadow-thick"
        >
            <div className="w-full h-auto p-2">
                <h1 className="text-black text-nowrap text-sm w-full font-light tracking-tight">
                    {notification}
                </h1>
            </div>

        </motion.div>
    )
}