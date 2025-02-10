import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    eslint: {
        ignoreDuringBuilds: false, // Ensures best practices are followed
    },
    typescript: {
        ignoreBuildErrors: false, // Prevents broken builds due to TypeScript errors
    },

    
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: `${process.env.UPLOADTHING_APP_ID}.ufs.sh`, // Dynamically allow based on ENV
                pathname: "/f/*",
            },
        ],
    },


    env: {
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID, // Kept private (not exposed to client)
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https:; frame-ancestors 'none';",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY", // Prevents Clickjacking
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff", // Prevents MIME-type sniffing
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload", // Enforces HTTPS
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "geolocation=(), microphone=(), camera=()", // Blocks unnecessary access
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
