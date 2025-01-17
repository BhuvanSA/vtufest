"use client";
import React from "react";
import { image5, image34, image42 } from "@/components/images/gallery";
import Image from "next/image";
import gat from "@/components/images/gat1.jpg";

const About = () => {
    return (
        <div>
            <div className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] text-[#bbc5c6]">
                <div className="container mx-auto">
                    <div className="   md:px-12 xl:px-6">
                        <div className="relative  ">
                            <div className="lg:w-2/3 md:text-center  mx-auto">
                                <h1 className="text-[#bbc5c6] font-bold text-4xl md:text-6xl xl:text-7xl">
                                    About
                                    <span className="text-primary text-[#e2af3e]">
                                        {" "}
                                        VTU
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-4 mt-10 flex flex-wrap items-center justify-between">
                        <div className="w-full px-4 lg:w-6/12">
                            <div className="-mx-3 flex items-center sm:-mx-4">
                                {/* <div className="w-full px-3 sm:px-4 xl:w-1/2"> */}
                                <div className="relative  z-10 my-4 h-auto max-w-lg transition-all duration-300 rounded-lg cursor-pointer filter ">
                                    <Image
                                        src={gat}
                                        alt=""
                                        className=" h-[350px] rounded-2xl "
                                    />
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
                            <div className="mt-10 lg:mt-0">
                                <p className="text-body-color text-justify mb-8 text-base">
                                VTU, a premier technological university in India, boasts 24 years of excellence in engineering and technical education, research, and innovation. Established in 1998, VTU aims to bridge the gap between industry needs and academic expertise, producing skilled engineers with a strong foundation in theory and practical experience.
The university has accomplished a monumental feat by unifying a diverse array of colleges, previously affiliated with various universities, under a single entity. This remarkable achievement has harmonized disparate syllabi, procedures, and traditions, fostering a cohesive academic environment.
VTU has a vast academic network, comprising 182 affiliated colleges, 1 constituent college, and 25 autonomous colleges. The university offers a diverse range of programs, including undergraduate degrees in 37 fields, postgraduate degrees in 96 fields, and research programs in Ph.D, M.sc (Engineering) across 7 faculties. With over 3 lakhs engineering students enrolled across its affiliated institutes, VTU is one of the largest technological universities in the country.
VTU has four regional centers across Karnataka namely Belagavi, Bengaluru, Kalaburagi and Mysuru, offering diverse programs in engineering, technology, and management. The university is dedicated to providing a world-class technical education environment and continues to serve the nation's technological advancement.
{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="   md:px-12 xl:px-6">
                        <div className="relative pt-36 ">
                            <div className="lg:w-2/3 md:text-center  mx-auto">
                                <h1 className="text-[#bbc5c6] font-bold text-4xl md:text-6xl xl:text-7xl">
                                    Summary of
                                    <span className="text-primary text-[#e2af3e]">
                                        {" "}
                                        VTU Fest.
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-4 mt-10 flex flex-wrap items-center justify-between">
                        <div className="w-full lg:w-1/2 xl:w-5/12">
                            <div className="mt-10 lg:mt-0">
                                <p className="text-body-color mb-8 text-justify text-base">
                                The VTU Youth Festival, a beloved annual tradition, brings together students from affiliated institutions for a vibrant celebration of creativity, talent, and community spirit. This year, Global Academy of Technology, Bengaluru, has the honor of hosting the 24th edition, aptly titled ''Interact 2025.'' This dynamic event aims to foster connections among young minds, provide a platform for self-expression, and showcase the diverse skills of participating students. ''Interact 2025'' promises to be an unforgettable experience, featuring an exciting array of music, dance, theater, art exhibitions, literary competitions, and workshops.By participating in 'Interact 2025,' students can tap into invaluable opportunities for networking, collaboration, and growth, making it an event not to be missed.{" "}
                                </p>
                            </div>
                        </div>
                        <div className="w-full px-4 lg:w-6/12">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
