
"use client"
import React from "react";
import Link from "next/link"; // Import Link to navigate
import OuterBox from "../../components/OuterBox";
import Heading from "../../components/Heading";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { WarningMessage } from "../../components/WarningMessage";
import '../globals.css';

const Login = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
 
    <OuterBox width="w-[120%]">
      <Heading label="Register Your College" />
      <InputField label="College Name" placeholder="Enter your college name" onChange={()=>{}} />
      <InputField label="Contact Person" placeholder="Enter your contact person"  onChange={()=>{}} />
      <InputField label="Contact Number" placeholder="Enter your contact person" type="tel" onChange={()=>{}} />
      <InputField label="Email Address" placeholder="Enter your email address" type="email" onChange={()=>{}} />
      <Button label="Register" OnClick={()=>{}} />
      <WarningMessage label="Already a User?" buttonText="Log In" to="/login" />
    </OuterBox>
   </div>
   </div>

  );
};

export default Login;
