import { Youtube, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer aria-label="Site Footer" className="bg-background">
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex justify-center text-foreground">
                    <h1 className="text-4xl">Global Academy of Technology</h1>
                </div>
                <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-muted-foreground">
                    Autonomous Institute, Affiliated to VTU Belagavi
                </p>

                <p className="mx-auto mt-4 max-w-md text-center leading-relaxed text-muted-foreground">
                    Aditya Layout, Rajarajeshwari Nagar, Bengaluru, Karnataka
                    560098
                </p>

                <ul className="mt-12 flex justify-center gap-6 md:gap-8">
                    <li>
                        <a
                            href="https://www.youtube.com/@GATINTERACT"
                            rel="noreferrer"
                            target="_blank"
                            className="text-muted-foreground transition hover:text-primary"
                        >
                            <span className="sr-only">Youtube</span>
                            <Youtube className="h-6 w-6" />
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://www.instagram.com/gatbengaluru/"
                            rel="noreferrer"
                            target="_blank"
                            className="text-muted-foreground transition hover:text-primary"
                        >
                            <span className="sr-only">Instagram</span>
                            <Instagram className="h-6 w-6" />
                        </a>
                    </li>
                </ul>

                <div className="mt-12 border-t border-border pt-6 flex justify-center">
                    <div className="text-center sm:flex sm:justify-between sm:text-left">
                        <p className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors sm:order-first sm:mt-0">
                            <a href="ourteam/">&copy; 2025 VOID</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
