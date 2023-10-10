/** @type {import('next').NextConfig} */

require('dotenv').config();

const { GOOGLE_APP_CLIENT_ID,
    GOOGLE_APP_CLIENT_SECRET,
    NEXTAUTH_SECRET } = process.env

const nextConfig = {
  env: {
    GOOGLE_APP_CLIENT_ID,
    GOOGLE_APP_CLIENT_SECRET,
    NEXTAUTH_SECRET
  }
}

module.exports = nextConfig
