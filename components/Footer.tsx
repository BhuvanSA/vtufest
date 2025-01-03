import { Youtube, Instagram } from "lucide-react";
import Image from "next/image";

const Footer = () => {
    return (
        <footer aria-label="Site Footer" className="bg-background">
            <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex justify-center mb-10">
                    <Image
                        src="/images/college-logo.png"
                        alt="global logo"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="flex flex-col justify-center text-foreground gap-y-2">
                    <h1 className="text-4xl text-center uppercase font-bold">
                        Global Academy of Technology
                    </h1>
                    <h2 className="text-2xl text-center font-bold text-primary">
                        Growing Ahead of Time ....
                    </h2>
                    <p className="text-lg text-center">
                        Autonomous Institute, Affiliated to VTU
                    </p>
                    <h2 className="text-2xl text-center font-bold text-primary">
                        A Unit of National Education Foundation
                    </h2>
                </div>

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
                            <a href="ourteam/">&copy; 2025</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
