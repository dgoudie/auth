/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.goudie.dev'],
    },
    async headers() {
        return [
            {
                source: '/login',
                headers: [
                    {
                        key: 'access-control-allow-origin',
                        value: '*',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
