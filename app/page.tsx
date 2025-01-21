// app/home/page.tsx
import React from "react";
import "./globals.css"; // Adjust the import path as needed
import Header from "@/components/Background";
import MessageCarousel from "@/components/MessageCarousel";
import Image from "next/image";
import background from "@/public/images/Untitled design (4).png";
import Presenthomepage from "@/components/Presenthomepage";

// import Gallery from "@/components/subcomponents/gallery";
// import Pronities from "@/components/subcomponents/pronities";
// import Events from "@/components/subcomponents/events";

const Home = () => {


    return (
        
        <div className="bg-background pt-16">
            <div className="w-full h-[50em] relative bottom-64 ">
                <Image
                    src={background}
                    alt="background"
                    
                    className="w-full   bg-gradient-to-b from-black/50 via-transparent  to-black/80"
                />
               <Presenthomepage/>
                </div>
            <div className="relative z-10">
                <section className="bg-background ">
                    <div className="ml-auto ">
                        <div className="lg:w-2/3 mt-10 text-justify mx-auto">
                            <h1 className="text-primary font-bold text-5xl md:text-6xl xl:text-7xl text-center flex flex-col">
                                <span className="text-primary ">About GAT</span>
                            </h1>

                            <h4 className="mt-8 text-black">
                                Global Academy of Technology (GAT), established in the year
                                2001, is one of the most sought-after engineering and management
                                colleges in Bengaluru, Karnataka. Located in a sprawling campus
                                of 10-acre land, GAT is a campus ideal for students to hone
                                their academics in an atmosphere of optimism. GAT provides ample
                                opportunities for various co-curricular and extra-curricular
                                activities for the students. The campus brims with more than
                                3500 students and 300 experienced staff involved in effective
                                Teaching and Learning Process. Academics is supplemented with
                                mentoring, peer learning and counselling to ensure holistic
                                development of students. GAT has academic alliances with various
                                institutions, industries, and research organizations to provide
                                industry perspective to the students.
                            </h4>
                            <div className="flex justify-between">
                                <div className="flex  space-x-2 mt-2">
                                    <svg
                                        className="w-6 h-6 text-[#bbc5c6]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="18"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span className="text-[#bbc5c6] ">TBD</span>
                                </div>
                                <div className="flex  space-x-2">
                                    <svg
                                        className="w-6 h-6 text-red-600"
                                        viewBox="0 0 24 24"
                                        fill="red"
                                        stroke="black"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 2 C7.03 2 3 6.03 3 11 C3 16.55 12 22 12 22 C12 22 21 16.55 21 11 C21 6.03 16.97 2 12 2 Z"></path>
                                        <circle cx="12" cy="11" r="4"></circle>
                                    </svg>
                                    <a href="https://maps.app.goo.gl/SQYGicDVGunvnhYc7">
                                        <span className="text-blue-800 font-semibold">
                                            Global Academy of Technology
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mt-16 justify-center">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="bg-background rounded-xl"
                                width="80%"
                                height="100% "
                            >
                                <source
                                    src="/backround_video.mp4"
                                    type="video/mp4"
                                    className="bg-background"
                                />
                            </video>
                        </div>
                        <div className=" mt-8 mx-10  justify-between">
                            <div className="px-0   md:px-12 xl:px-2">
                                <div className="relative pt-36 ">
                                    <div className="lg:w-2/3 md:text-center  mx-auto">
                                        <h1 className="text-[#bbc5c6] font-bold text-4xl md:text-6xl xl:text-7xl">

                                            <span className="text-primary text-[#e2af3e]">
                                                {" "}
                                                VTU Youth Fest 2025
                                            </span>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10  flex flex-wrap items-center text-center justify-center">
                                <div className="w-full text-justify mx-56 lg:w-full xl:w-full">
                                    <div className="mt-10 lg:mt-0">
                                        <p className="text-body-color text-center mb-8 text-justify text-base">
                                            The VTU Youth Festival, a beloved annual tradition, brings
                                            together students from affiliated institutions for a
                                            vibrant celebration of creativity, talent, and community
                                            spirit. This year, Global Academy of Technology,
                                            Bengaluru, has the honor of hosting the 24th edition,
                                            aptly titled ''Interact 2025.'' This dynamic event aims to
                                            foster connections among young minds, provide a platform
                                            for self-expression, and showcase the diverse skills of
                                            participating students. ''Interact 2025'' promises to be
                                            an unforgettable experience, featuring an exciting array
                                            of music, dance, theater, art exhibitions, literary
                                            competitions, and workshops.By participating in 'Interact
                                            2025,' students can tap into invaluable opportunities for
                                            networking, collaboration, and growth, making it an event
                                            not to be missed.{" "}
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="w-full px-4 lg:w-6/12">
                                    <div className="-mx-3 flex items-center sm:-mx-4">
                                        <div className="w-full px-3 sm:px-4 xl:w-1/2">
                                        <div className="py-3 sm:py-4">
                                            <Image
                                                src={image34}
                                                alt=""
                                                className="w-full rounded-2xl"
                                            />
                                        </div>
                                        <div className="py-3 sm:py-4">
                                            <Image
                                                src={image5}
                                                alt=""
                                                className="w-full rounded-2xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-3 sm:px-4 xl:w-1/2">
                                        <div className="relative z-10 my-4">
                                            <Image
                                                src={image42}
                                                alt=""
                                                className="w-full rounded-2xl"
                                            />
                                        </div>
                                    </div>
                                    </div>
                                </div> */}
                                <MessageCarousel />

                            </div>
                        </div>
                    </div>
                </section>
                {/* <div>
                <Gallery />
                <Pronities />
                <Events />
            </div> */}

            </div>
        </div>
    );
};

export default Home;
