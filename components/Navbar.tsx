"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import Image from "next/image"
import { ThemeToggler } from "@/contexts/theme-provider"
import { Menu, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import vtulogo from "@/public/images/vtulogo.png"
import MobileSidebar from "./MobileSidebar"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navItems = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
    { href: "/events", text: "Events" },
    { href: "/schedule", text: "Schedule" },
]

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Schedule",
        href: "/schedule",
        description: "A list of events, talks, and workshops happening during the event.",
    },
    {
        title: "Summary",
        href: "/summary",
        description: " A summary of the event, including the theme, date, and location.",
    },
]

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        )
    },
)
ListItem.displayName = "ListItem"

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname();
    const { isLoggedIn } = useAuthContext();

    return (
        <header className="fixed top-0 left-0 right-0 w-full  backdrop-blur-sm border-none w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg z-40">
            <Sparkles className="absolute top-2  left-3 text-yellow-300 h-6 w-6 animate-pulse" />
            <div className="flex items-center justify-between text-2xl mt-4 px-4 md:px-32">
                <div className="flex gap-3 w-full justify-between items-center">
                    <Image src="/images/college-logo.png" alt="College Logo" width={70} height={60} priority />
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-white font-bold tracking-widest transition-colors">
                            Global Academy of Technology
                        </h1>
                        <div className="text-white text-sm md:text-base font-semibold mt-1">
                            An Autonomous Institute, Affiliated to VTU
                        </div>
                    </div>
                    <Image src={vtulogo || "/placeholder.svg"} alt="VTU Logo" width={80} height={50} priority />
                </div>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-foreground hover:text-primary transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="hidden md:flex items-center flex-wrap justify-center max-w-6xl lg:max-w-[72rem] pb-2 xl:max-w-6xl px-3 mx-auto sm:px-6">
                <NavigationMenu>
                    <NavigationMenuList className="bg-inherit">
                        <NavigationMenuItem className="bg-inherit">
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-inherit`}>Home</NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={` bg-inherit`}>About</NavigationMenuTrigger>
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
                                                <div className="mb-0 mt-4 text-lg font-medium">Global Academy of Technology</div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Growing Ahead of time.. <br />
                                                    Autonomous Institute, <br />
                                                    Affiliated to VTU A Unit of National Education Foundation
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/about/vtu" title="About VTU">
                                        Information about VTU and its history.
                                    </ListItem>
                                    <ListItem href="/about/youthfest" title="About Youth Fest">
                                        About the Youth Fest and its history.
                                    </ListItem>
                                    <ListItem href="/Dignitaries" title="Organising Committee">
                                        Information about the Organising Committee.
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={` bg-inherit`}>Event</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {components.map((component) => (
                                        <ListItem key={component.title} title={component.title} href={component.href}>
                                            {component.description}
                                        </ListItem>
                                    ))}
                                    <ListItem href="/generalinstructions" title="General Instructions">
                                        Information about general instructions.
                                    </ListItem>
                                    <ListItem href="/rulesandregulations" title="Rules and Regulations">
                                        Information about rules and regulations.
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/contactus" legacyBehavior passHref>
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-inherit`}>
                                    Contact Us
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>

                        {isLoggedIn ? (
                            <>
                                <NavigationMenuItem>
                                    <Link href={"/register/getallregister"} legacyBehavior passHref>
                                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-inherit`}>
                                            Register
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href={"/auth/logout"} legacyBehavior passHref>
                                        <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-inherit`}>
                                            Logout
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </>
                        ) : (
                            <NavigationMenuItem>
                                <Link href="/auth/signin" legacyBehavior passHref>
                                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-inherit`}>
                                        Login
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        )}

                        <NavigationMenuItem>
                            <ThemeToggler />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <Sparkles className="absolute top-2 right-2 text-yellow-300 h-6 w-6 animate-pulse" />
        </header>
    )
}

export default NavBar


