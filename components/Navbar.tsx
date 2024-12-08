// /components/Navbar.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Navbar = () => {
  return (
    <header>
      <div className="logo">
        <Image
          src="/images/college-logo.png"
          alt="College Logo"
          width={80}
          height={80}
          className="header-logo"
        />
        <h1>GAT VTU Youth Fest 2025</h1>
        <p>Celebrating 25 Years of Excellence</p>
        <Image
          src="/images/fest-logo.png"
          alt="Fest Logo"
          width={80}
          height={80}
          className="header-logo"
        />
      </div>

      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/schedule">Schedule</Link>
          </li>
          <li>
            <Link href="/login" className="highlight">
              Login/Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
