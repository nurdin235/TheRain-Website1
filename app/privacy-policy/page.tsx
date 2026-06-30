import type { Metadata } from "next";
import { getLegacyPage } from "@/lib/legacy";
import { LegacyPage } from "@/components/LegacyPage";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, breadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy — TheRain",
  description:
    "Read how TheRain collects, uses, protects, and retains rider, driver, parent, guest, and fleet data for transport services in Cameroon.",
  alternates: { canonical: "https://therain.tech/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — TheRain",
    description: "Read TheRain’s data privacy policy for riders, drivers, parents, and fleet users in Cameroon.",
    url: "https://therain.tech/privacy-policy",
    images: [{ url: "https://therain.tech/images/bg.jpg", width: 1200, height: 630, alt: "TheRain privacy policy" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — TheRain",
    description: "Read TheRain’s data privacy policy for transport services in Cameroon.",
    images: ["https://therain.tech/images/bg.jpg"]
  }
};

export default function PrivacyPolicyPage() {
  const page = getLegacyPage("privacy-policy.html");
  return (
    <>
      <JsonLd data={organizationSchema("en")} />
      <JsonLd data={breadcrumbSchema("privacyPolicy", "en", "default")} />
      <LegacyPage {...page} />
    </>
  );
}
