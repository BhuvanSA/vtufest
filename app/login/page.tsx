// pages/login.tsx
"use client"
import React from "react";
 // Import Link to navigate
import OuterBox from "../../components/OuterBox";
import Heading from "../../components/Heading";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { WarningMessage } from "../../components/WarningMessage";
import { useState } from "react";
import '../globals.css';
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [username,setUsername] = useState("");
  const [password,setPassword] =useState("");
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
 
    <OuterBox width="w-96">
      <Heading label="Login" />
      <div className="">
      <InputField label="Username" placeholder="Enter your username" onChange={(e)=>setUsername(e.target.value)} />
      <InputField label="Password" placeholder="Enter your password" type="password" onChange={(e)=>setPassword(e.target.value)} />
      </div>
      <Button label="Login" OnClick={ async ()=>{
         const response = await axios.post("http://localhost:3000/api/login",{
            username,
            password
            
          })
           console.log(response)
           if (response.data.success) {
            // Navigate to the login page after signup
            router.push('/');
          } else {
            console.error('Signup failed');
          }
          
          } }/>
      <WarningMessage label="New User?" buttonText="Sign Up" to="/signup" />
    </OuterBox>
  
   </div>
   </div>
  );
};

export default Login;
