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
                                        Us.
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
                                    Global Academy of Technology was established
                                    in 2001, celebrating 25 years of excellence
                                    with the monumental objective of promoting
                                    academic excellence and competence in
                                    students, especially in the fast-growing
                                    global domain of Engineering Technology and
                                    Management. The Institute made remarkable
                                    progress since its inception in every aspect
                                    and gained name among the Institutes of
                                    Technology in the state of Karnataka due to
                                    the quality of education and training
                                    provided by its dedicated faculty and the
                                    infrastructure available.{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="   md:px-12 xl:px-6">
                        <div className="relative pt-36 ">
                            <div className="lg:w-2/3 md:text-center  mx-auto">
                                <h1 className="text-[#bbc5c6] font-bold text-4xl md:text-6xl xl:text-7xl">
                                    About
                                    <span className="text-primary text-[#e2af3e]">
                                        {" "}
                                        VTU Youth Fest.
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-4 mt-10 flex flex-wrap items-center justify-between">
                        <div className="w-full lg:w-1/2 xl:w-5/12">
                            <div className="mt-10 lg:mt-0">
                                <p className="text-body-color mb-8 text-justify text-base">
                                    VTU Youth Fest attracts participants from
                                    various colleges across the region. The fest
                                    features a wide range of events, including
                                    technical competitions, cultural
                                    performances, workshops, seminars, and
                                    sports activities. The technical
                                    competitions include coding challenges,
                                    hackathons, robotics competitions, and
                                    gaming events. There are also cultural
                                    events such as music and dance performances,
                                    fashion, and talent shows. Interact is known
                                    for its lively and energetic atmosphere,
                                    with participants from different colleges
                                    showcasing their talents and engaging in
                                    friendly competition. The fest provides a
                                    platform for students to showcase their
                                    skills and creativity and helps to foster a
                                    sense of community and collaboration among
                                    participants.{" "}
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
