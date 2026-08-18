import { useState } from "react";
import { linkService } from "@/service/linkService";
import type { Link } from "@/types/linkType";

export function useCreateLink() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: { title: string; url: string; isEnabled: boolean; rotationPool: boolean }) => {
    setIsCreating(true);
    setError(null);
    try {
      const newLink = await linkService.createLink(data);
      return newLink;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar link.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  return { create, isCreating, error };
}

export function useUpdateLink() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: Partial<Omit<Link, "id" | "clicks" | "order" | "isActive">>) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updatedLink = await linkService.updateLink(id, data);
      return updatedLink;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar link.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return { update, isUpdating, error };
}

export function useDeleteLink() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      await linkService.deleteLink(id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir link.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return { remove, isDeleting, error };
}

export function useReorderLinks() {
  const [isReordering, setIsReordering] = useState(false);

  const reorder = async (newOrderIds: string[]) => {
    setIsReordering(true);
    try {
      await linkService.reorderLinks(newOrderIds);
    } catch {
      // Background action, usually silent failure or toast in UI
    } finally {
      setIsReordering(false);
    }
  };

  return { reorder, isReordering };
}
