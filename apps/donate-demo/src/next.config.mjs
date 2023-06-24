/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@alttransfer/cross-chain-payment-react-sdk"],
};

export default config;
