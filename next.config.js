/** @type {import('next').NextConfig} */

require("dotenv").config();

const { NEXTAUTH_SECRET } = process.env;

const nextConfig = {
  env: {
    NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig;
