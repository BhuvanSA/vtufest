// NavItem.tsx
import Link from "next/link";

interface NavItemProps {
    href: string;
    text: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, text, isActive }) => {
    return (
        <Link
            href={{
                pathname: href,
            }}
            className={`xl:ml-0 ${
                isActive
                    ? "font-bold text-[#bbc5c6]"
                    : "font-normal text-gray-200 dark:text-gray-400"
            } hidden md:inline-block p-1 sm:px-4 sm:py-2 rounded-full hover:text-black hover:bg-gray-100 dark:hover:bg-midnight transition-all`}
        >
            <span
                className={`${
                    isActive
                        ? "py-1 border-b-2 border-teal-400 dark:border-teal-500"
                        : "capsize"
                }`}
            >
                {text}
            </span>
        </Link>
    );
};

export default NavItem;
