"use client"
import React from 'react'
import pronite1 from '@/components/images/cs.png';
import pronite2 from '@/components/images/cs.png';
import pronite3 from '@/components/images/cs.png';
import pronite4 from '@/components/images/cs.png';
import pronite5 from '@/components/images/cs.png';
import pronite6 from '@/components/images/cs.png';

import Link from 'next/link';
import Image from 'next/image';

const images = [
    {
        image: pronite1
    },
    {
        image: pronite2
    },
    {
        image: pronite3
    },
    {
        image: pronite4
    },
    {
        image: pronite5
    },
    {
        image: pronite6
    }
]
const Pronities = () => {
    return (
        <section >
            <div className="   md:px-12 xl:px-6">
                <div className="relative pt-36 ">
                    <div className="lg:w-2/3 text-center  mx-auto">
                        <h1 className="text-white font-bold text-4xl md:text-6xl xl:text-7xl">Pro<span className="text-primary text-[#EACD69]">-</span>Events<span className="text-primary text-[#EACD69]">.</span></h1>

                    </div>
                </div>
            </div>
            <div className="flex justify-center p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-5">
                    <div className='bg-white p-3  rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer'>
                        <Link href={{ pathname: `/registration/proeventsregistration` }}>
                            <Image className="h-auto max-w-full rounded-lg" src={pronite1} alt="Dalli Dhananjaya" />
                        </Link>    
                    </div>
                    <div className='bg-white p-3  rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer'>
                        <Link href={{ pathname: `/registration/proeventsregistration` }}>
                            <Image className="h-auto  max-w-full rounded-lg" src={pronite2} alt="Sapthami Gowda" />
                        </Link>
                    </div>
                    <div className='bg-white p-4  rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer'>
                        <Link href={{ pathname: `/registration/proeventsregistration` }}>
                            <Image className="h-auto w max-w-full rounded-lg" src={pronite3} alt="Aishwarya Rangarajan" />
                        </Link>
                    </div>
                    <div className='bg-white p-4  rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer'>
                        <Link href={{ pathname: `/registration/proeventsregistration` }}>
                            <Image className="h-auto w max-w-full rounded-lg" src={pronite4} alt="Swaraaha Band" />
                        </Link>
                    </div>
                    <div className='bg-white p-4  rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer'>
                        <Link href={{ pathname: `/registration/proeventsregistration` }}>
                            <Image className="h-auto w max-w-full rounded-lg" src={pronite5} alt="Nithin Kamat" />
                        </Link>
                    </div>
                    <div className='bg-white p-4  rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer'>
                        <Link href={{ pathname: `/registration/proeventsregistration` }}>
                            <Image className="h-auto w max-w-full rounded-lg" src={pronite6} alt="Vinay Music" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Pronities