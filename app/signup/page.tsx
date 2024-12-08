
"use client"
import React from "react";
 // Import Link to navigate
import OuterBox from "../../components/OuterBox";
import Heading from "../../components/Heading";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { WarningMessage } from "../../components/WarningMessage";
import '../globals.css';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [collegeName,setCollegeName] = useState("");
  const [collegeCode,setCollegeCode] =useState("");
  const [phone,setPhone] = useState("");
  const [userName,setUsername] =useState("");



  return (
    <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
 
    <OuterBox width="w-[120%]">
      <Heading label="Register Your College" />
      <InputField label="College Name" placeholder="Enter your college name" onChange={(e)=>setCollegeName(e.target.value)} />
      <InputField label="College Code" placeholder="Enter your college code"   onChange={(e)=>setCollegeCode(e.target.value)} />
      <InputField label="Contact Number" placeholder="Enter your contact number" type="tel" onChange={(e)=>setPhone(e.target.value)} />
      <InputField label="UserName" placeholder="Enter your username" type="email" onChange={(e)=>setUsername(e.target.value)} />
      <Button label="Register" OnClick={async ()=>{
          const response = await axios.post("http://localhost:3000/api/signup",{
               collegeName,
               collegeCode,
               phone,
               userName
            })

            
            if (response.data.success) {
              // Navigate to the login page after signup
              router.push('/login');
            } else {
              console.error('Signup failed');
            }
         
            
        
        }} />
      <WarningMessage label="Already a User?" buttonText="Log In" to="/login" />
    </OuterBox>
   </div>
   </div>

  );
};

export default Login;
