"use client";
import React from "react";
import Image from "next/image";
import gat from "@/components/images/gat1.jpg";
// Credential images – update these paths with your actual image files.
import affiliationImg from "@/components/images/affiliation.png";
import aicteImg from "@/components/images/aicte.png";
import recognizedImg from "@/components/images/recognized.png";

const About = () => {
  return (
    <div>
      <div className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] text-[#003366]">
        <div className="container mx-auto">
          {/* About Header */}
          <div className="px-4 md:px-12 xl:px-6">
            <div className="relative">
              <div className="lg:w-2/3 md:text-center mx-auto">
                <h1 className="text-[#003366] font-bold text-5xl md:text-7xl xl:text-8xl">
                  About <span className="text-[#F4D03F]"> GAT.</span>
                </h1>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between mt-10">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative z-10 transition-all duration-300 rounded-2xl cursor-pointer filter">
                <Image
                  src={gat}
                  alt="Global Academy of Technology"
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
              </div>
            </div>
            {/* Text Section */}
            <div className="w-full lg:w-1/2 px-4 mt-8 lg:mt-0">
              <div>
                <p className="text-body-color text-justify mb-6 text-xl">
                  Global Academy of Technology (GAT), <strong>established in 2001</strong>, is one of the most sought-after engineering and management colleges in Bengaluru, Karnataka. Nestled within a sprawling 10-acre campus, GAT provides an ideal environment for students to excel academically amidst an atmosphere of innovation and optimism.
                </p>
                <p className="text-body-color text-justify mb-6 text-xl">
                  This year <strong>2025</strong> marks a momentous milestone as the institution celebrates its <strong>Silver Jubilee – 25 years</strong> of academic excellence, innovation, and transformative education. With a legacy of shaping future leaders and achievers, GAT continues to set benchmarks in higher education, solidifying its position as a premier destination for aspiring engineers and managers.
                </p>
                <p className="text-body-color text-justify mb-6 text-xl">
                  GAT offers ample opportunities for various co-curricular and extracurricular activities, ensuring a well-rounded student experience. The campus is home to over <strong>3,500 students</strong> and <strong>300 experienced staff members</strong> dedicated to an effective teaching and learning process. Academics are further enriched through mentoring, peer learning, and counseling, fostering the holistic development of students. Additionally, GAT has established academic alliances with various institutions, industries, and research organizations to provide students with valuable industry perspectives.
                </p>
              </div>
            </div>
          </div>

          {/* Credentials Section */}
          <div className="px-4 md:px-12 xl:px-6 mt-16">
            <div className="relative pb-12">
              <div className="lg:w-2/3 md:text-center mx-auto">
                <h1 className="text-[#003366] font-bold text-5xl md:text-7xl xl:text-8xl">
                  Our <span className="text-[#F4D03F]">Credentials</span>
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between mt-10 space-y-8 md:space-y-0">
              {/* University Affiliation */}
              <div className="w-full md:w-1/3 px-4">
                <div className="p-6 border border-[#003366] rounded-none text-center">
                  {/* Credential Image */}
                  <div className="flex justify-center">
                    <Image
                      src={affiliationImg}
                      alt="University Affiliation"
                      width={150}
                      height={150}
                      className="mb-4"
                    />
                  </div>
                  {/* Credential Heading */}
                  <h2 className="text-3xl font-extrabold text-[#003366] mb-2">
                    University Affiliation
                  </h2>
                  {/* Credential Details */}
                  <p className="mt-2 text-xl text-justify">
                    The college has been affiliated with <strong className="text-[#F4D03F]">Visvesvaraya Technological University (VTU)</strong>, Belagavi, Karnataka, <strong>since 2001</strong>. This longstanding affiliation ensures our curriculum meets industry standards.
                  </p>
                </div>
              </div>
              {/* Approved by AICTE */}
              <div className="w-full md:w-1/3 px-4">
                <div className="p-6 border border-[#003366] rounded-none text-center">
                  {/* Credential Image */}
                  <div className="flex justify-center">
                    <Image
                      src={aicteImg}
                      alt="Approved by AICTE"
                      width={150}
                      height={150}
                      className="mb-4"
                    />
                  </div>
                  {/* Credential Heading */}
                  <h2 className="text-3xl font-extrabold text-[#003366] mb-2">
                    Approved by AICTE
                  </h2>
                  {/* Credential Details */}
                  <p className="mt-2 text-xl text-justify">
                    All the engineering and MBA programs offered by the college have been approved by the <strong className="text-[#F4D03F]">All India Council for Technical Education (AICTE)</strong>, ensuring adherence to high education standards.
                  </p>
                </div>
              </div>
              {/* Recognized by Govt. of Karnataka */}
              <div className="w-full md:w-1/3 px-4">
                <div className="p-6 border border-[#003366] rounded-none text-center">
                  {/* Credential Image */}
                  <div className="flex justify-center">
                    <Image
                      src={recognizedImg}
                      alt="Recognized by Govt. of Karnataka"
                      width={150}
                      height={150}
                      className="mb-4"
                    />
                  </div>
                  {/* Credential Heading */}
                  <h2 className="text-3xl font-extrabold text-[#003366] mb-2">
                    Recognized by Govt. of Karnataka
                  </h2>
                  {/* Credential Details */}
                  <p className="mt-2 text-xl text-justify">
                    Our programs are recognized by the <strong className="text-[#F4D03F]">Government of Karnataka</strong>, ensuring that our courses meet both regional and national benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-12 px-4">
            <p className="text-xl">
              For more details, visit:{" "}
              <a
                href="http://www.gat.ac.in"
                className="text-[#D32F23] font-bold"
                target="_blank"
                rel="noreferrer"
              >
                www.gat.ac.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
