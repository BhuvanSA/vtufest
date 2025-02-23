import Image from "next/image";
import insta from "@/public/images/logo2.png";
import yt from "@/public/images/logo1.png";
import facebook from "@/public/images/logo3.png";
import linkedin from "@/public/images/logo4.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer aria-label="Site Footer" className="bg-gradient-to-r from-yellow-300 to-yellow-500">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo and Header Section */}
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-center lg:items-center">
          {/* College Logo */}
          <div className="w-full lg:w-1/3 flex justify-center">
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
            <h1 className="text-4xl sm:text-4xl lg:text-5xl uppercase font-serif font-bold leading-tight text-gray-900 mb-2">
              Global Academy of Technology
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
              Growing Ahead of Time ....
            </h2>
            <p className="text-lg font-medium mb-2 text-gray-700">
              Autonomous Institute, Affiliated to VTU
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
              Institute of National Education Foundation
            </h2>
          </div>
        </div>

        {/* Social Media Links */}
        <ul className="mt-12 flex justify-center items-center gap-6">
          <li>
            <a
              href="https://www.youtube.com/@GATINTERACT"
              rel="noreferrer"
              target="_blank"
              className="transition hover:scale-110 inline-block"
              aria-label="YouTube Channel"
            >
              <Image
                src={yt}
                width={50}
                height={50}
                alt="YouTube"
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
                src={insta}
                width={50}
                height={50}
                alt="Instagram"
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
                src={facebook}
                width={50}
                height={50}
                alt="Facebook"
                className="object-contain"
              />
            </a>
          </li>

          <li>
            <a
              href="https://www.linkedin.com/company/global-academy-of-technology/"
              rel="noreferrer"
              target="_blank"
              className="transition hover:scale-110 inline-block"
              aria-label="LinkedIn Page"
            >
              <Image
                src={linkedin}
                width={50}
                height={50}
                alt="LinkedIn"
                className="object-contain"
              />
            </a>
          </li>
        </ul>

        {/* Footer Bottom Section */}
        <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-lg text-gray-900 font-bold text-center">
            © 2025 Global Academy of Technology
          </p>
          <p className="text-lg text-gray-900 font-bold text-center">
            Developed by Interact-2025 Technical Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
