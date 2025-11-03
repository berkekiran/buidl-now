import { MetadataRoute } from "next";
import { tools } from "@/lib/tools-list";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://buidlnow.com";

  // Homepage
  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  // Tool pages
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [homepage, ...toolPages];
}
