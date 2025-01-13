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
};

export default nextConfig;
