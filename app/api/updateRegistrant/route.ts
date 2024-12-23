import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
export async function PATCH(request : Request){
    const body = await request.json();
    const token : string = (await cookies()).get('auth_token')?.value;
    if(!token){
        return new Response("token not found",{status:401});
    }

    const verify = await jwtVerify(token,JWT_SECRET);
    if(!verify){
        return new Response("Unauthorized",{status:401});
    }

    const userId :string = verify.payload.id;

    
}