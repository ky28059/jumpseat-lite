/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    logging: {
        fetches: {
            fullUrl: true
        }
    }
}

module.exports = nextConfig;
