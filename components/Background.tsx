import Image from "next/image";
import logo from "@/components/images/logo.png";
const Background = () => {
    return (
        <>
            <div className="pt-24">
                <div className="relative inset-x-0 overflow-hidden">
                    <video
                        autoPlay
                        muted
                        loop
                        className="fixed inset-0 w-full h-screen object-cover opacity-40 -z-10"
                    >
                        <source src="/backround_video.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-screen-md md:mt-0 sm:mt-10">
                        <div className="relative h-0 pb-[100%] mt-[100px] md:-mt-10">
                            <Image
                                src={logo}
                                alt="logo"
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                        </div>
                        {/* <div className="relative h-0">
                            <Image src={logoText} alt="logo text" className="mx-auto w-full h-auto object-contain -mt-[100px] sm:-mt-[10px] md:-mt-[250px] lg:-mt-[300px]" />
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Background;
