import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Zod schema for validation
const sendPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = sendPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }

    const { email, password } = validation.data;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider (e.g., Gmail, Sendinblue, Outlook)
      auth: {
        user: process.env.EMAIL_USER as string, // Your email address
        pass: process.env.EMAIL_PASSWORD as string, // Your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: email, // Receiver email address
      subject: "Welcome to [Your Platform]",
      text: `Hello,\n\nThank you for signing up! Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.\n\nBest Regards,\nThe [Your Platform] Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Password emailed successfully!" });
  } catch (error) {
    console.error("Error sending password:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
