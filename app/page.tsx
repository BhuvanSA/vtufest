// app/home/page.tsx
import React from "react";
import "./globals.css";
import Header from "@/components/Background";

const Home = () => {
    return (
        <div className="bg-background pt-16">
            <Header />
            <div className="relative z-10">
                <section className="bg-background ">
                    <div className="ml-auto ">
                        <div className="lg:w-2/3 mt-10 text-justify mx-auto">
                            {/* <h1 className="text-primary font-bold text-5xl md:text-6xl xl:text-7xl text-center flex-col"> */}
                            <span className="text-primary mt-8 text-black">
                                <p
                                    style={{
                                        color: "#F4d03f",
                                        fontSize: "2.5rem",
                                    }}
                                >
                                    GLOBAL ACADEMY OF TECHNOLOGY
                                </p>
                                <p
                                    style={{
                                        color: "#D32f23",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    GROWING AHEAD OF TIME
                                </p>
                                <p
                                    style={{
                                        color: "#003366",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    AN AUTONOMOUS INSTITUTE, AFFILIATED TO VTU
                                </p>
                            </span>
                            {/* </h1> */}

                            <h4 className="mt-8 text-black">
                                <p>-- WHO WE ARE</p>
                                <p>
                                    AUTONOMOUS INSTITUTION WITH NAAC-A
                                    ACCREDITATION
                                </p>
                                <p>
                                    {" "}
                                    Global Academy of Technology is an A-grade
                                    college that is counted one amongst the best
                                    engineering colleges in Bangalore. Along
                                    with being equipped with modern technology
                                    and the perfect infrastructure, the college
                                    has an ambience and culture to accelerate
                                    learning. The Management, Principal and
                                    Staff of the institution believe in the
                                    overall development of the students and
                                    hence encourage them to participate in
                                    co-curricular, extra-curricular and sports
                                    events.
                                </p>
                                <p>-- Why is 2025 iconic for GAT?</p>
                                <p>
                                    {" "}
                                    This year 2025 marks a momentous milestone
                                    as the institution celebrates its Silver
                                    Jubilee – 25 years of academic excellence,
                                    innovation, and transformative education.
                                    With a legacy of shaping future leaders and
                                    achievers, GAT continues to set benchmarks
                                    in higher education, solidifying its
                                    position as a premier destination for
                                    aspiring engineers and managers
                                </p>
                            </h4>
                            <div className="flex justify-between">
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
