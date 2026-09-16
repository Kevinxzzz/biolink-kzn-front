import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { HomePage } from "../HomePage";

export default async function InfluencerPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const headersList = await headers();
  const host = headersList.get("host") || "";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    // Passamos o header host (ou x-forwarded-host) para que o backend extraia o domínio 
    // corretamente, conforme implementado no `extractDomain`.
    const url = `${baseUrl}/influencers/public/${slug}`;
    console.log(`[SSR] Validando influencer via: ${url} com host: ${host}`);

    const res = await fetch(url, {
      headers: {
        "x-forwarded-host": host,
        "host": host
      },
      cache: "no-store"
    });

    if (!res.ok) {
      notFound();
    }
    
    // Se o influenciador existir e for válido, carrega a HomePage passando o slug
    return <HomePage influencerSlug={slug} />;
  } catch (error) {
    console.error("Erro ao validar influenciador:", error);
    notFound();
  }
}
