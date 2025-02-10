import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import { signupSchema } from "@/lib/schemas/auth";
import { generatePassword } from "@/lib/generator";
import nodemailer from "nodemailer";
import { emailList } from "@/data/emailList";

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string, // Upstash Redis URL
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string, // Upstash Redis Token
});

// Function to map Zod errors to field-level error object
function mapZodErrors(zodError: z.ZodError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    zodError.errors.forEach((err) => {
        const fieldName = err.path[0];
        if (fieldName && !fieldErrors[fieldName]) {
            fieldErrors[fieldName] = err.message;
        }
    });
    return fieldErrors;
}

// Function to verify OTP internally
async function verifyOtp(
    email: string,
    otp: string
): Promise<{ success: boolean; message: string }> {
    try {
        const storedOtp = await redis.get<string>(`otp:${email}`);

        // Debug Logs
        // console.log(`Stored OTP for ${email}: ${storedOtp}`);
        // console.log(`Received OTP for ${email}: ${otp}`);

        if (!storedOtp) {
            console.log("OTP has expired or does not exist.");
            return {
                success: false,
                message: "OTP has expired or does not exist.",
            };
        }

        if (storedOtp != otp) {
            console.log(
                "Invalid OTP provided. Stored OTP:",
                storedOtp,
                "Received OTP:",
                otp
            );
            return { success: false, message: "Invalid OTP provided." };
        }

        // OTP is valid, delete it from Redis
        try {
            await redis.del(`otp:${email}`);
        } catch (error: unknown) {
            console.error("Error deleting OTP from Redis:", error);
        }

        return { success: true, message: "OTP verified successfully." };
    } catch (error: unknown) {
        console.error("Error verifying OTP internally:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Validate input with Zod schema
        const validation = signupSchema.safeParse(body);

        if (validation.success === false) {
            const fieldErrors = mapZodErrors(validation.error);
            return NextResponse.json({ success: false, errors: fieldErrors });
        }

        const { email, phone, otp, collegeCode, collegeName, region } =
            validation.data;
        console.log(collegeName, email, otp, phone);


        const checkEmail = emailList.findIndex((value:string)=> value===email);

        if(checkEmail===-1){
            return NextResponse.json({success:false, message:"email is not registered"},{status:400});
        }

        // Check if the user already exists in the database (by email or phone)
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ email }, { phone }, { collegeName }],
            },
        });
        console.log("the existing user", existingUser);

        if (existingUser) {
            return NextResponse.json({
                success: false,
                errors: {
                    email: "A user with this email or phone number and the college Name already exists.",
                },
            });
        }

        // Verify OTP entered by the user
        const otpValidation = await verifyOtp(email, otp);
        if (!otpValidation.success) {
            return NextResponse.json({
                success: false,
                errors: {
                    otp: otpValidation.message,
                },
            });
        }
        // console.log("the otp is success", otpValidation.success);

        const password: string = generatePassword(12) as string;
        // Hash the user's provided password
        const hashedPassword = await bcrypt.hash(password, 13);

        // console.log("hashed password", hashedPassword);

        // Create the user in the database
        const newUser = await prisma.users.create({
            data: {
                collegeName: collegeName,
                email,
                phone,
                password: hashedPassword, // Store the hashed password
                collegeCode: collegeCode,
                region: region,
            },
        });

        if (newUser) {
            const transporter = nodemailer.createTransport({
                service: "gmail", // Use your email provider
                auth: {
                    user: process.env.EMAIL_USER as string, // Your email address
                    pass: process.env.EMAIL_PASSWORD as string, // Your email password or app password
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER, // Sender's email
                to: email, // Receiver's email
                subject:
                    "Your Login Credentials for VTU Youth Fest at Global Academy of Technology",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h2 style="color: #007bff; text-align: center;">VTU Youth Fest - Login Credentials</h2>
                        <p>Dear principal of <strong>${newUser.collegeName}</strong>,</p>
                        <p>Thank you for registering for the VTU Youth Fest at <strong>Global Academy of Technology</strong>. Below are your login credentials:</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p><strong>Login Email:</strong> ${newUser.email}</p>
                            <p><strong>Password:</strong> ${password}</p>
                        </div>
                        <p>You can log in using the credentials above at the following link:</p>
                        <p style="text-align: center;">
                            <a href="https://vtufestinteract.com" target="_blank" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Login Now</a>
                        </p>
                        <p>If you have any issues logging in, please contact support.</p>
                        <p>Best regards,</p>
                        <p><strong>VTU Youth Fest Team</strong></p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        }

        // Return successful response
        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    phone: newUser.phone,
                    collegeName: newUser.collegeName,
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.log("Error in registration process:", error);
        return NextResponse.json(
            { success: false, errors: { general: "Internal Server Error" } },
            { status: 500 }
        );
    }
}
