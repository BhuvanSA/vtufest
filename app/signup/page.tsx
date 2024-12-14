'use client'

import { useState } from "react";
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
// import { use } from "framer-motion/client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Timer from "@/components/timer";

const SignUp = () => {
  const[college, setCollege] = useState('')
  const[phone, setPhone] = useState('')
  const[email, setEmail] = useState('')
  const[otp, setOTP] = useState('')
  const router=useRouter()

  const sendOTPalert = async() =>{
    try {
      // Make the POST request to send the email OTP
      const response = await axios.post("http://localhost:3000/api/sendEmailOtp", {
        email, // Ensure email is a valid state variable or prop
      });
  
      // Handle the response if needed
      if (response.status === 200) {
        // Toggle visibility
        setIsVisible(!isVisible);
  
        // Show a success toast
        toast.success(
          'OTP sent successfully! Check your email to access it. OTP is valid for 2 minutes.',
          { position: "bottom-left" }
        );
      } else {
        // Handle unexpected responses
        toast.error('Something went wrong. Please try again.', {
          position: "bottom-left",
        });
      }
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);
  
      // Display an error toast
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data?.message || 'Failed to send OTP. Please check your email and try again.',
          { position: "bottom-left" }
        );
      } else {
        toast.error('Failed to send OTP. Please check your email and try again.', {
          position: "bottom-left",
        });
      }
    }
  }
  const resendOTPalert = async() =>{
    try {
      // Make the POST request to send the email OTP
      const response = await axios.post("http://localhost:3000/api/sendEmailOtp", {
        email, // Ensure email is a valid state variable or prop
      });
      // Handle the response if needed
      if (response.status === 200) {
        // Toggle visibility
        setIsVisible(!isVisible);
  
        // Show a success toast
        toast.success(
          'OTP sent successfully! Check your email to access it. OTP is valid for 2 minutes.',
          { position: "bottom-left" }
        );
      } else {
        // Handle unexpected responses
        toast.error('Something went wrong. Please try again.', {
          position: "bottom-left",
        });
      }
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);
  
      // Display an error toast
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data?.message || 'Failed to send OTP. Please check your email and try again.',
          { position: "bottom-left" }
        );
      } else {
        toast.error('Failed to send OTP. Please check your email and try again.', {
          position: "bottom-left",
        });
      }
    }
  }

  const [isVisible, setIsVisible] = useState(false);
  const handleButtonClick = async () => {
    setIsVisible(true); // Set visibility to true to indicate action in progress
    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        college,
        phone,
        email,
        otp
      });
      if (response.status === 200) {
        router.push('/login');
      } else {
        toast.error("Signup failed. Please try again.", {
          position: "bottom-left",
        });
      }
    } catch (error: unknown) {
      console.error("Error during signup:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data?.message || "Failed to sign up. Please try again.",
          { position: "bottom-left" }
        );
      } else {
        toast.error("Failed to sign up. Please try again.", {
          position: "bottom-left",
        });
      }
    } finally {
      setIsVisible(false); // Reset visibility after action completes
    }
  };
  
  

  const isButtonDisabled = !college||!phone||!email||!otp;
  const isSendOTP = !email;
  const isResendOTP = !email;



  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 ">
      <motion.div
          initial={{opacity: 0,y: -20}}
          animate = {{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">VTU Fest Sign-UP</h1>
            <p className="text-muted-foreground">Enter your Student Credentials</p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="string">College Name</Label>
              <Input
                id="collegeName"
                type="string"
                placeholder="Global Academy of Technology"
                value={college}
                onChange={(e)=>setCollege(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                id="phone"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                required
                />
              </div>
            </div>
           <div className="space-y-2">
           <Label htmlFor="useremail">Email</Label>
              <div className="relative">
                <Input
                id="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="example@somemail.com"
                required
                />
                <button
                  type="button"
                  onClick={sendOTPalert}
                  disabled={isSendOTP}
                  className="absolute right-3 top-1 transform-y-1/2 text-gray-500 hover:text-gray-700"
                  >{isVisible ? 'Send OTP' : 'Send OTP'}
                </button>
                {isVisible && <Timer initialSeconds={120}/>}
                <ToastContainer/>
                  </div>
            </div> 
            <div className="space-y-2">
           <Label htmlFor="useremail">Enter OTP</Label>
              <div className="relative">
                <Input
                id="email"
                value={otp}
                onChange={(e)=>setOTP(e.target.value)}
                placeholder="Enter 4 digit OTP sent to your E-mail"
                required
                />
                <button
                  type="button"
                  onClick={resendOTPalert}
                  disabled={isResendOTP}
                  className="absolute right-3 top-1 transform-y-1/2 text-gray-500 hover:text-gray-700"
                >Resend OTP
                </button>
                </div>
            </div>
            
            <Button
        type="button" // Change the type to "button" if it doesn't submit the form
        className="w-full"
        disabled={isButtonDisabled}
        onClick={handleButtonClick} // Add the onClick handler
      >
        Sign Up
      </Button>

          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"/>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Already Registered ?</span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
            <Link href={"/login"}>
            <Button type="submit" className="w-full">              
              Sign IN
            </Button>
            </Link>
            </div>

          </div>
        </div>


      </motion.div>
    </div>
 );
}


export default SignUp;