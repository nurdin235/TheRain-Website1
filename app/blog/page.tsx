import type { Metadata } from "next";
import { getLegacyPage } from "@/lib/legacy";
import { LegacyPage } from "@/components/LegacyPage";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, breadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "TheRain Blog — News, Insights & Updates | Cameroon",
  description:
    "Read the latest news and insights from TheRain — tips for riders and drivers in Cameroon, road safety updates, tech launches, and company announcements.",
  alternates: { canonical: "https://therain.tech/blog" },
  openGraph: {
    type: "website",
    siteName: "TheRain",
    title: "TheRain Blog — News, Insights & Updates",
    description: "Latest news and updates from TheRain — ride-hailing, delivery, and school transport in Cameroon.",
    url: "https://therain.tech/blog",
    images: [{ url: "https://therain.tech/images/bg.jpg", width: 1200, height: 630, alt: "TheRain Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheRain Blog — News, Insights & Updates",
    description: "Latest news and insights from TheRain in Cameroon.",
    images: ["https://therain.tech/images/bg.jpg"],
  },
};

export default function BlogPage() {
  const page = getLegacyPage("blog.html");
  return (
    <>
      <JsonLd data={organizationSchema("en")} />
      <JsonLd data={breadcrumbSchema("blog", "en", "default")} />
      <LegacyPage {...page} />
    </>
  );
}
