import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TheRain",
    short_name: "TheRain",
    description: "Ride-hailing, delivery, school transport, and fleet services in Cameroon.",
    start_url: "/",
    display: "standalone",
    background_color: "#060E1F",
    theme_color: "#0A84FF",
    icons: [
      {
        src: "/images/favicon.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}