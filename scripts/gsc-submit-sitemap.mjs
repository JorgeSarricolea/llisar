#!/usr/bin/env node
/**
 * Submit / re-submit Llisar sitemap to Google Search Console (local only).
 * Same pattern as ChecaFactura: personal Google AccountChooser → GSC Sitemaps UI.
 *
 *   node scripts/gsc-submit-sitemap.mjs
 *   → opens GSC; add https://llisar.com/sitemap.xml if missing.
 *
 * Optional API:
 *   GSC_CLIENT_ID=… GSC_CLIENT_SECRET=… GSC_REFRESH_TOKEN=… node scripts/gsc-submit-sitemap.mjs --api
 */
import { spawn } from "node:child_process";

const PERSONAL_GOOGLE = "jjorgesarricolea18@gmail.com";
/** Domain property (same shape as ChecaFactura sc-domain:…). */
const SITE_URL = "sc-domain:llisar.com";
const SITEMAP_URL = "https://llisar.com/sitemap.xml";
const GSC_UI =
  "https://accounts.google.com/AccountChooser?Email=" +
  encodeURIComponent(PERSONAL_GOOGLE) +
  "&continue=" +
  encodeURIComponent(
    "https://search.google.com/search-console/sitemaps?resource_id=" +
      encodeURIComponent(SITE_URL),
  );

const useApi = process.argv.includes("--api");

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  spawn(cmd, [url], { detached: true, stdio: "ignore" }).unref();
}

async function submitViaApi() {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.error(
      "Missing GSC_CLIENT_ID / GSC_CLIENT_SECRET / GSC_REFRESH_TOKEN for --api",
    );
    process.exit(1);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error("OAuth token error:", tokenJson);
    process.exit(1);
  }

  const sitePath = encodeURIComponent(SITE_URL);
  const feedPath = encodeURIComponent(SITEMAP_URL);
  const putRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${sitePath}/sitemaps/${feedPath}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    },
  );
  if (!putRes.ok) {
    console.error("GSC submit failed:", putRes.status, await putRes.text());
    process.exit(1);
  }
  console.log("Submitted", SITEMAP_URL, "for", SITE_URL);
}

const PAGES = [
  "https://llisar.com/",
  "https://llisar.com/nosotros",
  "https://llisar.com/contacto",
  "https://llisar.com/blog",
  "https://llisar.com/blog/como-atender-leads-inmobiliaria-whatsapp",
  "https://llisar.com/blog/agente-ia-whatsapp-turismo-cuando-conviene",
  "https://llisar.com/blog/calificar-leads-inmobiliarios-whatsapp",
  "https://llisar.com/blog/agendar-visitas-desde-whatsapp",
  "https://llisar.com/blog/errores-atencion-whatsapp-inmobiliaria-turismo",
];

if (useApi) {
  await submitViaApi();
} else {
  console.log("Opening Search Console sitemaps for", SITE_URL);
  console.log("If the sitemap is not listed, add:", SITEMAP_URL);
  console.log("\nAlso request indexing (URL Inspection) for:");
  for (const u of PAGES) console.log(" -", u);
  openBrowser(GSC_UI);
  // URL inspection deep-link for the new blog hub
  openBrowser(
    "https://accounts.google.com/AccountChooser?Email=" +
      encodeURIComponent(PERSONAL_GOOGLE) +
      "&continue=" +
      encodeURIComponent(
        "https://search.google.com/search-console/inspect?resource_id=" +
          encodeURIComponent(SITE_URL) +
          "&id=" +
          encodeURIComponent("https://llisar.com/blog"),
      ),
  );
}
