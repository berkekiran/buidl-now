import { notFound } from "next/navigation";
import { ToolStructuredData } from "@/components/structured-data";
import { HomePageClient } from "@/app/page";
import { tools } from "@/lib/tools-list";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = tools.find((item) => item.id === id);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <ToolStructuredData tool={tool} />
      <HomePageClient
        includeSiteStructuredData={false}
        initialSelectedToolId={id}
        routeMode="tool"
      />
    </>
  );
}
