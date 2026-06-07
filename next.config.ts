import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  // Opt these packages out of Next.js server bundling so they load via the
  // native Node.js require/import. Required for:
  //   - pdf-parse / pdfjs-dist: avoid the fake-worker SSR error
  //   - chromadb: uses native http bindings not compatible with the bundler
  //   - @langchain/community: large optional package with native deps
  serverExternalPackages: [
    "pdf-parse",
    "pdfjs-dist",
    "chromadb",
    "@langchain/community",
  ],
};

export default nextConfig;
