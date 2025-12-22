import { motion } from "framer-motion"
import AccountActions from "./AccountActions"
import { variants } from "@/motion/variants"
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function AccManagement() {
    const showDeleteModal = useSelector((state: RootState) => state.profileNav.displayDeleteModal);

    return (
        <motion.section
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.3 }}
            className="min-h-svh 2xl:w-full md:px-8 scroll-smooth inset mx-auto relative">
            <AccountActions />


        </motion.section>
    );
};

