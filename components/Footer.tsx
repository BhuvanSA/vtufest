import Image from "next/image";
import insta from "@/public/images/instalogo.png";
import yt from "@/public/images/youtube_1384060.png";
import facebook from "@/public/images/facebook_logo_icon_147291.png";

const Footer = () => {
    return (
        <footer aria-label="Site Footer" className="bg-background">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Logo and Header Section */}
                <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-center lg:items-center">
                    {/* College Logo */}
                    <div className="w-full lg:w-1/3 flex justify-center lg:justify-center">
                        <Image
                            src="/images/college-logo.png"
                            alt="Global Academy of Technology logo"
                            width={150}
                            height={150}
                            className="object-contain"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-2/3 text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl uppercase font-bold leading-tight text-blue-900 mb-2">
                            Global Academy of Technology
                        </h1>
                        <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-2">
                            Growing Ahead of Time ....
                        </h2>
                        <p className="text-lg font-bold mb-2">Autonomous Institute, Affiliated to VTU</p>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                            A Unit of National Education Foundation
                        </h2>
                    </div>
                </div>

                {/* Social Media Links */}
                <ul className="mt-12 flex justify-center gap-6">
                    <li>
                        <a
                            href="https://www.youtube.com/@GATINTERACT"
                            rel="noreferrer"
                            target="_blank"
                            className="transition hover:scale-110 inline-block"
                            aria-label="YouTube Channel"
                        >
                            <Image
                                src={yt || "/placeholder.svg"}
                                width={40}
                                height={40}
                                alt=""
                                className="object-contain"
                            />
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://www.instagram.com/gatbengaluru/"
                            rel="noreferrer"
                            target="_blank"
                            className="transition hover:scale-110 inline-block"
                            aria-label="Instagram Profile"
                        >
                            <Image
                                src={insta || "/placeholder.svg"}
                                width={40}
                                height={40}
                                alt=""
                                className="object-contain"
                            />
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://www.facebook.com/globalacademyoftech/"
                            rel="noreferrer"
                            target="_blank"
                            className="transition hover:scale-110 inline-block"
                            aria-label="Facebook Page"
                        >
                            <Image
                                src={facebook || "/placeholder.svg"}
                                width={40}
                                height={40}
                                alt=""
                                className="object-contain"
                            />
                        </a>
                    </li>
                </ul>

                {/* Footer Bottom Section */}
                <div className="mt-12 border-t border-border pt-6">
                    <p className="text-center text-sm text-muted-foreground">
                        <a href="/ourteam" className="hover:text-primary transition">
                            &copy; {new Date().getFullYear()} Global Academy of Technology
                        </a>
                        <br></br>
                        <br />
                        <a href="/developer" className="hover:text-primary transition pt-4">
                            Developed by
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

