import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: `${process.env.UPLOADTHING_APP_ID}.ufs.sh`,
                pathname: "/f/*",
            },
        ],
    },
    env: {
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
        // convert this to NEXT_PUBLIC_UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
        // if the env needs to be accessed in a client component
    },
};

export default nextConfig;
