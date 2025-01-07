import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeProviderProps = {
    children: React.ReactNode;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}

export function ThemeToggler() {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative h-9 w-9"
            >
                {theme === "dark" ? (
                    <MoonIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
                ) : (
                    <SunIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
                )}
            </Button>
        </div>
    );
}
