import type { Metadata } from "next";
import { getLegacyPage } from "@/lib/legacy";
import { LegacyPage } from "@/components/LegacyPage";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, breadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service — TheRain",
  description:
    "Read therain terms for ride-hailing, delivery, school transport, driver accounts, payments, safety, support, and platform responsibilities in Cameroon.",
  alternates: { canonical: "https://therain.tech/terms-of-service" },
  openGraph: {
    title: "Terms of Service — TheRain",
    description: "Read TheRain’s terms of service for riders, drivers, and transport users in Cameroon.",
    url: "https://therain.tech/terms-of-service",
    images: [{ url: "https://therain.tech/images/bg.jpg", width: 1200, height: 630, alt: "TheRain terms of service" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — TheRain",
    description: "Read TheRain’s terms of service for transport users in Cameroon.",
    images: ["https://therain.tech/images/bg.jpg"]
  }
};

export default function TermsOfServicePage() {
  const page = getLegacyPage("terms-of-service.html");
  return (
    <>
      <JsonLd data={organizationSchema("en")} />
      <JsonLd data={breadcrumbSchema("termsOfService", "en", "default")} />
      <LegacyPage {...page} />
    </>
  );
}
