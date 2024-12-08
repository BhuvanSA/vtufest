// pages/login.tsx
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
   <div>
    <OuterBox>
      <Heading label="Login" />
      <InputField label="Username" placeholder="Enter your username" onChange={()=>{}} />
      <InputField label="Password" placeholder="Enter your password" type="password" onChange={()=>{}} />
      <Button label="Login" OnClick={()=>{}} />
      <WarningMessage label="New User?" buttonText="Sign Up" to="/signup" />
    </OuterBox>
   </div>
  );
};

export default Login;
