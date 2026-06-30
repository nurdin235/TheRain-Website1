import fs from "node:fs";
import path from "node:path";

const htmlRoutes: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about",
  "how-it-works.html": "/how-it-works",
  "contact.html": "/contact",
  "blog.html": "/blog",
  "privacy-policy.html": "/privacy-policy",
  "terms-of-service.html": "/terms-of-service",
  "data-deletion.html": "/data-deletion",
  "terms.html": "/terms",
  "article1.html": "/blog/therain-launches-in-yaounde",
  "article2.html": "/blog/school-transport-child-safety",
  "article3.html": "/blog/driver-earnings-tips-cameroon"
};

function sourcePath(fileName: string): string {
  return path.join(process.cwd(), "content", "legacy", fileName);
}

function rewriteHref(href: string): string {
  const clean = href.replace(/&amp;/g, "&").trim();
  if (
    clean.startsWith("http") ||
    clean.startsWith("//") ||
    clean.startsWith("#") ||
    clean.startsWith("mailto:") ||
    clean.startsWith("tel:") ||
    clean.startsWith("/")
  ) {
    return clean;
  }
  const [file, hash] = clean.split("#");
  const route = htmlRoutes[file];
  if (route) return hash ? `${route}#${hash}` : route;
  if (clean.startsWith("images/")) return `/${clean}`;
  return clean;
}

function rewriteAnchors(html: string): string {
  return html.replace(/<a(\s[^>]*)href="([^"]*)"([^>]*)>/gi, (_m, before, href, after) => {
    return `<a${before}href="${rewriteHref(href)}"${after}>`;
  });
}

function rewriteAssetPaths(html: string): string {
  // Rewrite src="images/..." and href="images/..." in HTML attributes
  return html.replace(/\b(src|href)="images\/([^"]*)"/gi, (_m, attr, rest) => `${attr}="/images/${rest}"`);
}

function rewriteScriptPaths(script: string): string {
  // Rewrite "images/..." string literals inside scripts
  return script.replace(/"images\//g, '"/images/');
}

export type LegacyPageData = {
  css: string;
  bodyHtml: string;
  inlineScripts: string[];
};

export function getLegacyPage(sourceFile: string): LegacyPageData {
  const source = fs.readFileSync(sourcePath(sourceFile), "utf8");

  // Extract all CSS from <style> blocks
  const cssBlocks = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const css = cssBlocks.map((m) => m[1]).join("\n");

  // Extract body content
  const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const rawBody = bodyMatch ? bodyMatch[1] : "";

  // Extract inline scripts (those without a src attribute)
  const scriptMatches = [...rawBody.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)];
  const inlineScripts = scriptMatches
    .map((m) => rewriteScriptPaths(m[1]))
    .filter((s) => s.trim().length > 0);

  // Strip all script tags from body HTML
  const noScripts = rawBody.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // Rewrite asset paths and anchor hrefs
  const rewritten = rewriteAnchors(rewriteAssetPaths(noScripts));

  // Fix: .aos elements start with opacity:0 in CSS, waiting for IntersectionObserver
  // which only runs after client-side JS hydration. This causes blank sections on load.
  // Remove the hide-by-default so content is always visible; keep the transition
  // so if JS does fire the class change it still animates smoothly.
  const fixedCss = css
    .replace(/\.aos\{opacity:0;/g, ".aos{opacity:1;")
    .replace(/\.aos \{ opacity: 0;/g, ".aos { opacity: 1;");

  return { css: fixedCss, bodyHtml: rewritten, inlineScripts };
}
