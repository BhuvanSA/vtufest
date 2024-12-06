import { getRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    const slug = (await params).slug 
    const usn = slug;
    console.log(usn);

    const response = await getRegistrant(usn);

    return NextResponse.json({success:true,response})
  }