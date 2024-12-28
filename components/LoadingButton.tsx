import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ loading, children, className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={cn("w-full", className)}
                disabled={loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </>
                ) : (
                    children
                )}
            </Button>
        );
    }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
