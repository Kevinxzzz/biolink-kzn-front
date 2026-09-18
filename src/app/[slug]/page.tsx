import { HomePage } from "../HomePage";

export default async function InfluencerPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  return <HomePage influencerSlug={slug} />;
}
