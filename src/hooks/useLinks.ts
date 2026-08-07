import { useState, useEffect, useCallback } from "react";
import { linkService } from "@/service/linkService";
import type { Link, ScheduledChange } from "@/types/link";

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [scheduledChanges, setScheduledChanges] = useState<ScheduledChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedLinks, fetchedScheduled] = await Promise.all([
        linkService.getLinks(),
        linkService.getScheduledChanges()
      ]);
      setLinks(fetchedLinks);
      setScheduledChanges(fetchedScheduled);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar links.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return { links, scheduledChanges, isLoading, error, refetch: fetchLinks };
}
