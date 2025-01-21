import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import Image1 from '@/public/images/1710529304549.jpeg.jpg';
import Image2 from "@/public/images/1733070759022.png";
import Image3 from "@/public/images/1735673424888.jpeg.jpg"
import  image4 from "@/public/images/1713973297954.jpeg.jpg"
import imageicon from "@/public/images/instalogo.png"
import imageicon1 from "@/public/images/icons8-linkedin-48.png"
import imageicon2 from '@/public/images/icons8-github-64.png'
import imageicon3 from "@/public/images/icons8-twitter-30.png"
const list = [
  {
    name: 'Bhuvan S A',
    linkedIn: '',
    insta: '',
    twitter: '',
    github: '',
    image : Image1,
  },
  {
    name: 'Sohan K E',
    linkedIn: '',
    insta: '',
    twitter: '',
    github: '',
    image : image4
  },
  {
    name: 'Rahul S Srivastava',
    linkedIn: '',
    insta: '',
    twitter: '',
    github: '',
    image : Image3
  },
  {
    name: 'Kottapalli Likhith Reddy',
    linkedIn: '',
    insta: '',
    twitter: '',
    github: '',
    image: Image2
  },
  {
    name: 'Keerthan K Archarya',
    linkedIn: '',
    insta: '',
    twitter: '',
    github: '',
    image: Image2
  }
]

const Page = () => {
  return (
    <div className='mt-28 px-6'>
      <Card>
        <CardHeader>
          <h1 className='text-blue-800 text-center text-5xl font-bold'>
            Developer
          </h1>
        </CardHeader>
      </Card>

      <div className='grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3'>
        {list.map((person, index) => (
          <Card key={index} className='p-4 shadow-lg'>
            <CardHeader>
              <h2 className='text-lg font-bold text-center'>{person.name}</h2>
            </CardHeader>
            <CardContent className='flex items-center justify-center'>
                <Image 
                src={person.image}
                alt='image'
                className='rounded-full'
                width={250}
                />
            </CardContent>
            <CardFooter className='flex gap-3 items-center justify-center'>
                <Image
                src={imageicon}
                alt='image'
                width={50}
                />
                <Image
                src={imageicon1}
                alt='image'
                width={70}
                />
                <Image
                src={imageicon2}
                alt='image'
                width={70}
                />
                <Image
                src={imageicon3}
                alt='image'
                width={70}
                />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
