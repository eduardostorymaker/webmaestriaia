import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://skynet-team.mx"
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/auth/"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}