import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
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
                <Sun className="" />
                <span className="sr-only">Toggle theme</span>{" "}
            </Button>
        </div>
    );
}
