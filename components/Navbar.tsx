import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import NavItem from "./NavItem";
import { Dialog, DialogOverlay } from "./ui/dialog";
import { useAuthContext } from "@/contexts/auth-context";
import Image from "next/image";
import { ThemeToggler } from "@/contexts/theme-provider";

export const navItems = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
    { href: "/events", text: "Events" },
    { href: "/schedule", text: "Schedule" },
    { href: "/register", text: "Register" },
];

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { isLoggedIn } = useAuthContext();

    const handleClick = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <header className="fixed top-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-b border-border shadow-sm z-50">
            <div className="flex items-center justify-between max-w-6xl lg:max-w-[72rem] xl:max-w-6xl px-4 py-6 mx-auto sm:px-6">
                <div className="flex items-center">
                    <Link href="/" passHref className="flex items-center gap-3">
                        <Image
                            src="/images/college-logo.png"
                            alt="College Logo"
                            width={40}
                            height={40}
                            priority
                            className=""
                        />
                        <span className="text-foreground hover:text-primary transition-colors">
                            Global Academy of Technology
                        </span>
                    </Link>
                </div>
                <div className="hidden lg:block overflow-x-auto whitespace-nowrap">
                    <nav className="flex space-x-3 text-lg">
                        {navItems.map(({ href, text }, index) => (
                            <NavItem
                                key={index}
                                href={href}
                                text={text}
                                isActive={
                                    (pathname.startsWith(href) &&
                                        href !== "/") ||
                                    pathname === href
                                }
                            />
                        ))}
                        {isLoggedIn ? (
                            <NavItem
                                href="/auth/logout"
                                text="Logout"
                                isActive={pathname.startsWith("/auth")}
                            />
                        ) : (
                            <NavItem
                                href="/auth/signin"
                                text="Login"
                                isActive={pathname.startsWith("/auth")}
                            />
                        )}
                    </nav>
                </div>
                <ThemeToggler />
                <div className="-my-2 -mr-2 lg:hidden" onClick={handleClick}>
                    <MobileMenu />
                </div>
            </div>

            {isOpen && (
                <Dialog open={isOpen}>
                    <DialogOverlay className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                    <div className="fixed w-full max-w-xs p-6 text-base font-semibold bg-card text-card-foreground rounded-lg shadow-lg right-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors top-5 right-5"
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
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <p className="text-foreground hover:text-primary transition-colors">
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

export default NavBar;
