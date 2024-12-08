// pages/register.tsx

import React from "react";
import Link from "next/link"; // Import Link to navigate

const Register = () => {
  return (
    <>
    <center>
         <h2>Register Your College</h2>
    </center>
   
    <section id="register">
      
      <form action="success.html" method="POST">
        {/* College Details */}
        <div className="form-group">
          <label htmlFor="college-name">College Name:</label>
          <input
            type="text"
            id="college-name"
            name="college-name"
            placeholder="Enter your college name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="college-address">College Address:</label>
          <textarea
            id="college-address"
            name="college-address"
            rows={3}
            placeholder="Enter your college address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-person">Contact Person:</label>
          <input
            type="text"
            id="contact-person"
            name="contact-person"
            placeholder="Enter the name of the contact person"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-number">Contact Number:</label>
          <input
            type="tel"
            id="contact-number"
            name="contact-number"
            placeholder="Enter the contact number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>
        
        <button type="submit">Register</button>
      </form>
    </section>
    </>
  );
};

export default Register;
