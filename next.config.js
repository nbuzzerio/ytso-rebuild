/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  image: {
    domains: ['https://yt3.ggpht.com/'],
},
}

module.exports = nextConfig
