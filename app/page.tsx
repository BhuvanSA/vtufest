// app/home/page.tsx
import React from "react";
import "./globals.css"; // Adjust the import path as needed
import Header from "@/components/Background";
import Gallery from "@/components/subcomponents/gallery";
// import Pronities from "@/components/subcomponents/pronities";
// import Events from "@/components/subcomponents/events";

const Home = () => {
    return (
        <div className="bg-background">
            <Header />

            <div className="relative z-10">
                <section className="bg-background">
                    <div className="ml-auto ">
                        <div className="lg:w-2/3 text-justify mx-auto">
                            <h1 className="text-primary font-bold text-5xl md:text-6xl xl:text-7xl text-center flex flex-col">
                                24th
                                <span className="text-primary ">
                                    VTU Youth Festival
                                </span>
                            </h1>
                            <h4 className="mt-8 text-secondary">
                                The 24th VTU Youth Festival, organized by
                                Visvesvaraya Technological University, is a
                                prestigious platform that celebrates the spirit
                                of creativity, talent, and cultural harmony
                                among students from across the state. Over the
                                course of several days, the festival features an
                                extensive lineup of events including classical
                                and contemporary music, dance performances,
                                drama, literary contests, photography, and fine
                                arts exhibitions. It serves as a stage for
                                students to showcase their skills, connect with
                                peers, and immerse themselves in a vibrant
                                cultural atmosphere. In addition to fostering
                                artistic expression, the festival encourages
                                teamwork, leadership, and healthy competition.
                                With enthusiastic participation from colleges
                                affiliated with VTU, this annual gathering
                                stands as a testament to the rich cultural
                                fabric of the student community, while nurturing
                                the growth of future leaders in various fields.
                            </h4>
                            <div className="flex justify-between mt-10">
                                <div className="flex  space-x-2">
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
                                        <line
                                            x1="16"
                                            y1="2"
                                            x2="16"
                                            y2="6"
                                        ></line>
                                        <line
                                            x1="8"
                                            y1="2"
                                            x2="8"
                                            y2="6"
                                        ></line>
                                        <line
                                            x1="3"
                                            y1="10"
                                            x2="21"
                                            y2="10"
                                        ></line>
                                    </svg>
                                    <span className="text-[#bbc5c6]">TBD</span>
                                </div>
                                <div className="flex  space-x-2">
                                    <svg
                                        className="w-6 h-6 text-[#bbc5c6]"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 2 C7.03 2 3 6.03 3 11 C3 16.55 12 22 12 22 C12 22 21 16.55 21 11 C21 6.03 16.97 2 12 2 Z"></path>
                                        <circle cx="12" cy="11" r="4"></circle>
                                    </svg>
                                    <a href="https://maps.app.goo.gl/SQYGicDVGunvnhYc7">
                                        <span className="text-[#bbc5c6]">
                                            Global Academy of Technology
                                        </span>
                                    </a>
                                </div>
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
