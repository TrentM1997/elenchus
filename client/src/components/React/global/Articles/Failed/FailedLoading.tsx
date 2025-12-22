import FailedNotification from "./FailedNotification"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store"

export default function FailedLoading({ }): JSX.Element | null {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { read } = investigateState
    const { failedNotifications } = read


    return (
        <motion.ul
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 1, ease: [0.2, 0.6, 0.2, 1] } }}
            exit={{ opacity: 0 }}
            className="2xl:top-20 2xl:right-6 sm:top-16 bottom-20 right-2 flex fixed z-20 flex-col gap-y-6">
            <AnimatePresence initial={false}>
                {failedNotifications?.map((notification: any) => (
                    <FailedNotification

                        key={notification.article_url}
                        notification={notification}
                    />
                ))}
            </AnimatePresence>

        </motion.ul>
    );
};