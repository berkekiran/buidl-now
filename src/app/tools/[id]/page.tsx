import { redirect } from "next/navigation";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/?tool=${encodeURIComponent(id)}#tools`);
}
