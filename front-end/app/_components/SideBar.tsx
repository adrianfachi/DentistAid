"use client"

import Link from "next/link";
import { FiCalendar } from "react-icons/fi";
import { FiCheckSquare, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

type Props = {
    active: string;
};

export default function SideBar({ active }: Props) {
    const icons = [
        { Icon: FiCalendar, key: "calendar", link: "/calendar" },
        { Icon: FiUsers, key: "users", link: "/" },
        { Icon: FiCheckSquare, key: "tasks", link: "/tasks" },
    ];

    return (
        <div className="min-h-full p-3 shadow-blue-soft bg-background flex flex-col gap-10">
            <img src="logo.svg" alt="logo" className="w-16" />
            <div className="flex flex-col items-center gap-2.5 relative">
                {icons.map(({ Icon, key, link }) => (
                    <Link href={link} key={key} className="relative">
                        {active === key && (
                            <motion.div
                                layoutId="activeIcon"
                                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ligth-green"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            />
                        )}
                        <motion.div
                            className="relative z-10 p-3 rounded-2xl text-gray"
                            animate={{
                                color: active === key ? "#fff" : "#b5b5b5", // branco / gray-400
                            }}
                            transition={{ delay: 0.2, duration: 0.1 }}
                        >
                            <Icon size={28} />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}