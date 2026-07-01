import type { Metadata } from "next";
import {
  BRAND_NAME,
  DEFAULT_OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  blogKeys,
  canonicalPath,
  localizedPath,
  pageMeta,
  socialLinks,
  type Locale,
  type PageKey
} from "@/data/site";
import { blogPosts, faqs, services, text } from "@/data/content";

export function buildPageMetadata(
  pageKey: PageKey,
  locale: Locale,
  variant: "default" | "localized" = "localized"
): Metadata {
  const page = pageMeta[pageKey];
  const canonical = absoluteUrl(canonicalPath(pageKey, locale, variant));
  const image = absoluteUrl(page.image || DEFAULT_OG_IMAGE);
  const baseTitle = text(page.title, locale);
  const baseDescription = text(page.description, locale);
  const title = variant === "localized" && locale === "en" ? `${baseTitle} | English` : baseTitle;
  const description =
    variant === "localized" && locale === "en"
      ? `${baseDescription} This is the English version of the official TheRain page.`
      : baseDescription;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: page.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl(localizedPath(pageKey, "en")),
        fr: absoluteUrl(localizedPath(pageKey, "fr")),
        "x-default": absoluteUrl(page.path)
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      type: page.type === "article" ? "article" : "website",
      publishedTime: page.publishedTime,
      modifiedTime: page.modifiedTime
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    icons: {
      icon: "/images/favicon.png",
      apple: "/images/favicon.png"
    }
  };
}

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "TransportationService"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    alternateName: "therain.tech",
    url: SITE_URL,
    logo: absoluteUrl("/images/logo_dark.png"),
    image: absoluteUrl("/images/bg.jpg"),
    description:
      locale === "fr"
        ? "TheRain est une plateforme camerounaise de technologie de transport proposant VTC, livraison, transport scolaire et gestion de flotte."
        : "TheRain is a Cameroon transport technology platform offering ride-hailing, delivery, school transport, and fleet services.",
    areaServed: { "@type": "Country", name: "Cameroon" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Commercial Avenue",
      addressLocality: "Bamenda",
      addressCountry: "CM"
    },
    email: "info@therain.tech",
    telephone: ["+237676011861", "+237674321486"],
    sameAs: socialLinks.map((link) => link.href),
    serviceType: ["Ride-hailing", "Delivery", "School transport", "Fleet management"]
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: BRAND_NAME,
    alternateName: ["TheRain Cameroon", "therain.tech"],
    url: `${SITE_URL}/`,
    inLanguage: locale === "fr" ? "fr-CM" : "en-CM",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function breadcrumbSchema(pageKey: PageKey, locale: Locale, variant: "default" | "localized" = "localized") {
  const current = pageMeta[pageKey];
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: locale === "fr" ? "Accueil" : "Home",
      item: absoluteUrl(canonicalPath("home", locale, variant))
    }
  ];

  if (pageKey !== "home") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: text(current.title, locale),
      item: absoluteUrl(canonicalPath(pageKey, locale, variant))
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

export function servicesSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "fr" ? "Services TheRain" : "TheRain services",
    itemListElement: services.slice(0, 5).map((service, index) => ({
      "@type": "Service",
      position: index + 1,
      name: text(service.title, locale),
      description: text(service.summary, locale),
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Cameroon" },
      serviceType: text(service.title, locale)
    }))
  };
}

export function faqSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: text(faq.question, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: text(faq.answer, locale)
      }
    }))
  };
}

export function blogPostingSchema(pageKey: PageKey, locale: Locale) {
  const post = blogPosts.find((item) => item.key === pageKey);
  const meta = pageMeta[pageKey];
  if (!post || !blogKeys.includes(pageKey)) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: text(post.title, locale),
    description: text(post.excerpt, locale),
    image: absoluteUrl(post.image),
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime,
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: SITE_URL
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(localizedPath(pageKey, locale)),
    inLanguage: locale === "fr" ? "fr-CM" : "en-CM"
  };
}

export function pageSchemas(pageKey: PageKey, locale: Locale, variant: "default" | "localized" = "localized") {
  const schemas: unknown[] = [breadcrumbSchema(pageKey, locale, variant)];

  if (pageKey === "home") schemas.push(servicesSchema(locale), faqSchema(locale));
  if (pageKey === "services") schemas.push(servicesSchema(locale));

  const article = blogPostingSchema(pageKey, locale);
  if (article) schemas.push(article);

  return schemas;
}
