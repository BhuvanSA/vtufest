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
                    ? "font-bold text-foreground"
                    : "font-normal text-muted-foreground"
            } hidden md:inline-block p-1 sm:px-4 sm:py-2 rounded-full hover:text-primary-foreground hover:bg-primary transition-all`}
        >
            <span
                className={`${
                    isActive ? "py-1 border-b-2 border-primary" : "capsize"
                }`}
            >
                {text}
            </span>
        </Link>
    );
};

export default NavItem;
