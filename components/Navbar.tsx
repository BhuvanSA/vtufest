"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { Dialog, DialogOverlay } from "./ui/dialog";
import { useAuthContext } from "@/contexts/auth-context";
import Image from "next/image";
import { ThemeToggler } from "@/contexts/theme-provider";
import { X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
    { href: "/events", text: "Events" },
    { href: "/schedule", text: "Schedule" },
];

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
];

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { isLoggedIn } = useAuthContext();

    const handleClick = () => {
        setIsOpen(true);
    };

    return (
        <header className="fixed top-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-b border-border shadow-sm z-50">
            <div className="flex items-center justify-between text-2xl">
                <Image
                    src="/images/college-logo.png"
                    alt="College Logo"
                    width={40}
                    height={40}
                    priority
                    className=""
                />
                <h1 className="text-foreground hover:text-primary transition-colors">
                    Global Academy of Technology
                </h1>
                <Image
                    src="/images/college-logo.png"
                    alt="College Logo"
                    width={40}
                    height={40}
                    priority
                    className=""
                />
            </div>
            <div className="flex items-center justify-center max-w-6xl lg:max-w-[72rem] xl:max-w-6xl px-4 py-6 mx-auto sm:px-6">
                <div className="hidden lg:block overflow-x-auto whitespace-nowrap">
                    <nav className="flex space-x-3 text-lg">
                        {navItems.map(({ href, text }, index) => (
                            <NavItem
                                key={index}
                                href={href}
                                text={text}
                                isActive={
                                    pathname === href ||
                                    (pathname.startsWith(
                                        "/" + href.split("/")[1]
                                    ) &&
                                        href !== "/")
                                }
                            />
                        ))}
                        {isLoggedIn ? (
                            <>
                                <NavItem
                                    href="/register/getallregister"
                                    text="Register"
                                    isActive={pathname.startsWith("/register")}
                                />
                                <NavItem
                                    href="/auth/logout"
                                    text="Logout"
                                    isActive={pathname.startsWith("/auth")}
                                    className="hover:bg-red-500"
                                />
                            </>
                        ) : (
                            <>
                                <NavItem
                                    href="/auth/signin"
                                    text="Login"
                                    isActive={pathname.startsWith("/auth")}
                                />
                            </>
                        )}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <ThemeToggler />
                    </div>
                    <div
                        className="lg:hidden flex items-center"
                        onClick={handleClick}
                    >
                        <Menu />
                    </div>
                </div>
            </div>
            {/* new navigation menu */}
            <div className="flex items-center justify-center max-w-6xl lg:max-w-[72rem] xl:max-w-6xl px-4 py-6 mx-auto sm:px-6">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Home
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Getting started
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/"
                                            >
                                                {/* <Icons.logo className="h-6 w-6" /> */}
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    shadcn/ui
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Beautifully designed
                                                    components that you can copy
                                                    and paste into your apps.
                                                    Accessible. Customizable.
                                                    Open Source.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/docs" title="Introduction">
                                        Re-usable components built using Radix
                                        UI and Tailwind CSS.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/installation"
                                        title="Installation"
                                    >
                                        How to install dependencies and
                                        structure your app.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/primitives/typography"
                                        title="Typography"
                                    >
                                        Styles for headings, paragraphs,
                                        lists...etc
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Organising Committe
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/generalinstructions" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    General Instructions
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link
                                href="/rulesandregulations"
                                legacyBehavior
                                passHref
                            >
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Rules and Regulations
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Event</NavigationMenuTrigger>
                            <NavigationMenuContent className="">
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    {components.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/contactus" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Contact Us
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/auth/signin" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Login
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
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
                            <X className="h-6 w-6" />
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
                            <li>
                                {isLoggedIn ? (
                                    <Link
                                        href="/auth/logout"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <p className="text-foreground hover:text-primary transition-colors">
                                            Logout
                                        </p>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/auth/signin"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <p className="text-foreground hover:text-primary transition-colors">
                                            Login
                                        </p>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </Dialog>
            )}
        </header>
    );
};

export default NavBar;
