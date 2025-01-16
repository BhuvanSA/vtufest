"use client";
import { Weight } from 'lucide-react';
import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div>
            <div className="overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] text-[#bbc5c6]">
                <div className="container mx-auto">
                    <div className="   md:px-12 xl:px-6">
                        <div className="relative  ">
                            <div className="lg:w-2/3 md:text-center  mx-auto">
                                <h1 className="text-[#bbc5c6] font-bold text-4xl md:text-6xl xl:text-7xl">
                                    Contact
                                    <span className="text-primary text-[#e2af3e]">
                                        {" "}
                                        US.
                                    </span>
                                </h1>
                            </div>
                            <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0', boxSizing: 'border-box', backgroundColor: 'white', color: 'grey' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '20px' }}>
                                    <div style={{ flex: '1 1 45%', maxWidth: '500px', margin: '10px', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
                                        <h2 style={{ color: 'blue', textAlign: 'center' }}>Feel free to contact us!</h2>
                                            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div>
                                                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Full name</label>
                                                    <input type="text" id="name" name="name" placeholder="Full Name" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                                                    <input type="email" id="email" name="email" placeholder="name@example.com" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone Number</label>
                                                    <input type="text" id="phone" name="phone" placeholder="Phone Number" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
                                                </div>
                                                <div>
                                                    <label htmlFor="college" style={{ display: 'block', marginBottom: '5px' }}>College</label>
                                                    <input type="text" id="college" name="college" placeholder="Enter your College Name" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
                                                </div>
                                                <div>
                                                    <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Message</label>
                                                    <textarea id="message" name="message" rows={4} placeholder="Mention your query!" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required></textarea>
                                                </div>
                                                <button type="submit" style={{ backgroundColor: '#004f9e', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                                    Submit
                                                </button>
                                            </form>
                                    </div>

        <div style={{ flex: '1 1 45%', maxWidth: '500px', margin: '10px', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
          <h2 style={{ color: '#333', textAlign: 'center' }}>Global Academy of Technology</h2>
          <p><strong>Email:</strong>Email-ID</p>
          <p><strong>Phone:</strong></p>
          <ul>
            <li>+91 9999999999</li>
            <li>+91 9999999999</li>
          </ul>
          <p><strong>Address:</strong> Address</p>
          <div style={{ marginTop: '20px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7548449596075!2d77.52525822409484!3d12.923472037387445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3e4df6c0dca1%3A0x83c84d9e506b84b4!2sGlobal%20Academy%20Of%20Technology%2C%204%2C%20Bangarappanagar%20Main%20Rd%2C%20Bangarappanagar%2C%20Rajarajeshwari%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560098!5e0!3m2!1sen!2sin!4v1737016725143!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: '0' }}
              allowFullScreen
              loading="lazy"
            ></iframe>
            </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default ContactUs;