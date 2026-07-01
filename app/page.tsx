import type { Metadata } from "next";
import { getLegacyPage } from "@/lib/legacy";
import { LegacyPage } from "@/components/LegacyPage";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, websiteSchema, servicesSchema, faqSchema } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "TheRain | Ride-Hailing, Delivery & Comfort in Cameroon",
  description:
    "TheRain is Cameroon’s leading transport platform for ride-hailing, delivery, school transport, fleet management, and safer mobility across Cameroon.",
  alternates: { canonical: "https://therain.tech/" },
  openGraph: {
    title: "TheRain | Ride-Hailing, Delivery & Comfort in Cameroon",
    description:
      "TheRain is Cameroon’s leading transport platform for ride-hailing, delivery, school transport, and fleet management.",
    url: "https://therain.tech/",
    siteName: "TheRain",
    type: "website",
    images: [{ url: "https://therain.tech/images/bg.jpg", width: 1200, height: 630, alt: "TheRain transport platform in Cameroon" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "TheRain | Ride-Hailing, Delivery & Comfort in Cameroon",
    description:
      "TheRain is Cameroon’s leading transport platform for ride-hailing, delivery, school transport, and fleet management.",
    images: ["https://therain.tech/images/bg.jpg"]
  }
};

export default function HomePage() {
  const page = getLegacyPage("index.html");
  return (
    <>
      <JsonLd data={organizationSchema("en")} />
      <JsonLd data={websiteSchema("en")} />
      <JsonLd data={servicesSchema("en")} />
      <JsonLd data={faqSchema("en")} />
      <LegacyPage {...page} />
    </>
  );
}