/** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
      async redirects() {
        return [
          {
            source: '/telegram',
            destination: '/join-telegram',
            permanent: false,
          },
        ];
      },
    };

    module.exports = nextConfig;
    