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
import gatLogo from "@/public/images/old-college-logo.png"
import vtulogo from '@/public/images/vtulogo.png'
import background from "@/public/images/Untitled design (2).png";

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
        title: "Schedule",
        href: "/schedule",
        description:
            "A list of events, talks, and workshops happening during the event.",
    },
    {
        title: "Summary",
        href: "/summary",
        description:
            " A summary of the event, including the theme, date, and location.",
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

        <header className=" w-full bg-transparent absolute top-0 text-primary_heading backdrop-blur-sm border-none fixed z-10 shadow-4xl">
            
            <div className="flex ">
            <div className="flex items-center gap-2 mx-5 text-2xl">
                <Image
                    src={gatLogo}
                    alt="College Logo"
                    width={60}
                    height={60}
                    priority
                    className=""
                />
                <Image
                    src={vtulogo}
                    alt="College Logo"
                    width={80}
                    height={80}
                    priority
                    className="  "
                />
            </div>
            <div>
            <div className="mx-auto text-primary_heading text-xl font-bold relative right-5 top-5 text-primary_heading">
                    Global Academy of Technology
                    {/* <div className="text-red-500  text-xl font-semibold mt-2 text-left tracking-widest ">
                        An Autonomus Institute, Affiliated to VTU
                    </div> */}
                </div>
            </div>
            <div className="flex items-center text-white justify-center max-w-6xl lg:max-w-[72rem] xl:max-w-4xl px-3 py-3 mx-auto sm:px-6">
                <NavigationMenu>
                    <NavigationMenuList className="flex gap-0 ">
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
                            <NavigationMenuTrigger>About</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="flex h-full w-full select-none flex-col justify-end bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                href="/about"
                                            >
                                                <div className="flex justify-center items-center">
                                                    <Image
                                                        src="/images/college-logo.png"
                                                        height={40}
                                                        width={40}
                                                        alt="Global Academy of Technology"
                                                    />
                                                </div>
                                                <div className="mb-0 mt-4 text-lg font-medium">
                                                    Global Academy of
                                                    Techonology
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Growing Ahead of time..{" "}
                                                    <br />
                                                    Autonomous Institute, <br />
                                                    Affiliated to VTU A Unit of
                                                    National Education
                                                    Foundation
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/about" title="About GAT">
                                        Information about the college and its
                                        history.
                                    </ListItem>
                                    <ListItem
                                        href="/about/vtu"
                                        title="About VTU"
                                    >
                                        Information about VTU and its history.
                                    </ListItem>
                                    <ListItem
                                        href="/about/youthfest"
                                        title="About Youth Fest"
                                    >
                                        About the Youth Fest and its history.
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
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
                            <Link href="/Dignitaries" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Organising Committe
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link
                                href="/generalinstructions"
                                legacyBehavior
                                passHref
                            >
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
                            <Link href="/contactus" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={navigationMenuTriggerStyle()}
                                >
                                    Contact Us
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>


                        {isLoggedIn ? (
                            <>
                                <NavigationMenuItem>
                                    <Link href={"/register/getallregister"} legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={navigationMenuTriggerStyle()}

                                        >Register</NavigationMenuLink>
                                    </Link></NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href={"/auth/logout"} legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={navigationMenuTriggerStyle()}
                                        >Logout</NavigationMenuLink>
                                    </Link></NavigationMenuItem>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin" legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}

                                    >Login</NavigationMenuLink>
                                </Link>
                            </>
                        )}

                        <NavigationMenuItem>
                            <ThemeToggler />
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
            </div>
            {/* new navigation menu */}
           
        </header>
    );
};

export default NavBar;
