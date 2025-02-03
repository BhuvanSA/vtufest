import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, college, message } = await req.json();
    
    if (!name || !email || !phone || !college || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
      port: parseInt(process.env.EMAIL_PORT || "465", 10), // e.g., 465 for Gmail
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Sender's email address
        pass: process.env.EMAIL_PASSWORD, // Password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to: process.env.EMAIL_TO, // Receiver's email from .env
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        College: ${college}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>College:</strong> ${college}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
