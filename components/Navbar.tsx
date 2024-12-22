// NewNavBar.tsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import NavItem from "./NavItem";

export const navItems = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
    { href: "/events", text: "Events" },
    { href: "/schedule", text: "Schedule" },
    { href: "/login", text: "Log In" },
    { href: "/logout", text: "Logout" },
];

// TODO: Implment logout functionality as before here
// TODO: Overlay causes errors in the application

const NavMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const handleClick = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className="fixed top-0 left-0 right-0 w-full bg-slate-900/75 backdrop-blur-sm shadow-lg z-50 text-white">
            <div className="flex items-center justify-between max-w-6xl lg:max-w-[72rem] xl:max-w-6xl px-4 py-6 mx-auto sm:px-6">
                <div className="flex items-center">
                    <Link href="/" passHref>
                        <span className="opacity-3000 hover:text-lightGreen dark:hover:text-white mr-8">
                            Global Academy of Technology
                        </span>
                    </Link>
                </div>
                <div className="-my-2 -mr-2 lg:hidden" onClick={handleClick}>
                    <MobileMenu />
                </div>
                <div className="hidden lg:block overflow-x-auto whitespace-nowrap">
                    <nav className="flex space-x-3 text-lg">
                        {navItems.map(({ href, text }, index) => (
                            <NavItem key={index} href={href} text={text} />
                        ))}
                    </nav>
                </div>
            </div>
            {isOpen && (
                <Dialog
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="fixed inset-0 z-50 lg:hidden"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-gray-900/80" />
                    <div className="fixed w-full max-w-xs p-6 text-base font-semibold text-gray-900 bg-white rounded-lg shadow-lg top-4 right-4 dark:bg-gray-800 dark:text-gray-400 dark:highlight-white/5">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute flex items-center justify-center w-8 h-8 text-gray-500 top-5 right-5 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <span className="sr-only">Close navigation</span>
                            <svg
                                viewBox="0 0 10 10"
                                className="w-2.5 h-2.5 overflow-visible"
                                aria-hidden="true"
                            >
                                <path
                                    d="M0 0L10 10M10 0L0 10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                ></path>
                            </svg>
                        </button>
                        <ul className="space-y-6">
                            {navItems.map(({ href, text }) => (
                                <li key={href}>
                                    <Link
                                        href={{
                                            pathname: href,
                                            
                                        }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <p className="hover:text-lightGreen dark:hover:text-emerald-500">
                                            {text}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Dialog>
            )}
        </header>
    );
};

export default NavMenu;
