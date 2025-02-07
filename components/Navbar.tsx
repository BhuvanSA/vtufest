"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import Image from "next/image"
import { ThemeToggler } from "@/contexts/theme-provider"
import { Menu } from "lucide-react"
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
    description:
      "A list of events, talks, and workshops happening during the event.",
  },
  {
    title: "Summary",
    href: "/summary",
    description:
      "A summary of the event, including the theme, date, and location.",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            // Advanced styling: smooth color transition, subtle blue background on hover,
            // and blue text color when hovered/focused.
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors duration-200 hover:bg-blue-100 hover:text-blue-500 focus:bg-blue-100 focus:text-blue-500",
            className
          )}
          {...props}
        >
          <div className="text-base font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-base leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isLoggedIn } = useAuthContext()

  return (
    <header className={`fixed top-0 left-0 right-0 p-3 w-full backdrop-blur-sm bg-transparent shadow-lg z-40`}>
      {/* Header Container */}
      <div className=" mx-auto  w-full px-4 md:px-16">
        <div className="flex flex-col justify-around  items-center md:flex-row md:space-x-4">
          <div className="flex flex-row flex-wrap items-center justify-center">
            <img src="/images/vtulogo.png" alt="VTU Logo" className="h-14 " />
            <div className="text-sm md:mt-0">
              <p className="font-semibold text-primary " >
                VISVESVARAYA TECHNOLOGICAL UNIVERSITY
              </p>
              <p className="text-xs text-red-400">
                (STATE TECHNOLOGICAL UNIVERSITY, GOVT. OF KARNATAKA)
              </p>
            </div>
          </div>
          <div className="text-xl font-bold mt-2 md:mt-0 md:whitespace-nowrap flex flex-col items-center justify-center leading-tight" style={{ fontFamily: "Roboto" }}>
            <p className="text-yellow-500">24TH VTU YOUTH FEST</p>
            <p className="text-red-500">INTERACT 2025</p>
          </div>

          <div className="flex flex-row gap-2 flex-wrap-reverse items-center  mt-4 md:mt-0">
            <div className="text-sm text-center md:text-right">
              <p className="font-semibold text-primary">GLOBAL ACADEMY OF TECHNOLOGY</p>
              <p className="text-xs text-red-400">AUTONOMOUS INSTITUTE, AFFILIATED TO VTU</p>
            </div>
            <div>
              <img
                src="/images/college-logo.png"
                alt="GAT Logo"
                className="h-12 mt-2  mb-2 md:mt-0"
              />
            </div>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="absolute bottom-20 right-2 text-black  border-2 p-1 rounded-xs font-extrabold hover:text-blue-500 transition-colors duration-200 "
          > 
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="hidden md:flex items-center mt-5  flex-wrap justify-center max-w-6xl lg:max-w-[72rem] pb-1 px-3 mx-auto sm:px-6">
        <NavigationMenu>
          <NavigationMenuList className="bg-inherit">
            {/* Home */}
            <NavigationMenuItem className="bg-inherit">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-inherit text-xl hover:text-blue-500 transition-colors duration-200"
                  )}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* About Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-inherit text-xl hover:text-blue-500 transition-colors duration-200">
                About
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[350px] lg:w-[450px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md transition-colors duration-200 hover:text-blue-500"
                        href="/about"
                      >
                        <div className="flex justify-center items-center">
                          <Image
                            src="/images/college-logo.png"
                            height={30}
                            width={30}
                            alt="Global Academy of Technology"
                          />
                        </div>
                        <div className="mb-0 mt-4 text-base font-medium">
                          Global Academy of Technology
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Growing Ahead of time.. <br />
                          Autonomous Institute, <br />
                          Affiliated to VTU A Unit of National Education
                          Foundation
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

            {/* Event Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-inherit text-xl hover:text-blue-500 transition-colors duration-200">
                Event
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[350px] gap-3 p-4 md:w-[450px] md:grid-cols-2 lg:w-[550px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
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

            {/* Contact */}
            <NavigationMenuItem>
              <Link href="/contactus" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-inherit text-xl hover:text-blue-500 transition-colors duration-200"
                  )}
                >
                  Contact Us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Conditional Auth Links */}
            {isLoggedIn ? (
              <>
                <NavigationMenuItem>
                  <Link href={"/register/getallregister"} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-inherit text-xl hover:text-blue-500 transition-colors duration-200"
                      )}
                    >
                      Register
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href={"/auth/logout"} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-inherit text-xl hover:text-blue-500 transition-colors duration-200"
                      )}
                    >
                      Logout
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            ) : (
              <NavigationMenuItem>
                <Link href="/auth/signin" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-inherit text-xl hover:text-blue-500 transition-colors duration-200"
                    )}
                  >
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

            {/* Theme Toggler */}
            <NavigationMenuItem>
              <ThemeToggler />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar

        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}

export default NavBar;


