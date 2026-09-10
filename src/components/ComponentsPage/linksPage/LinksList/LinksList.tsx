"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Link } from "@/types/linkType";
import type { Category } from "@/types/categoryType";
import { SortableLinkItem } from "./SortableLinkItem";
import styles from "./LinksList.module.scss";

interface LinksListProps {
  links: Link[];
  categories: Category[];
  isReordering: boolean;
  isActivating: boolean;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
  onActivate: (link: Link) => void;
}

export function LinksList({
  links,
  categories,
  isReordering,
  isActivating,
  onDragEnd,
  onEdit,
  onDelete,
  onActivate,
}: LinksListProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const linksByCategory = useMemo(() => {
    const grouped: Record<string, Link[]> = {};
    categories.forEach((cat) => {
      grouped[cat.id] = [];
    });
    grouped["uncategorized"] = [];

    links.forEach((link) => {
      if (link.categoryId && grouped[link.categoryId]) {
        grouped[link.categoryId].push(link);
      } else {
        grouped["uncategorized"].push(link);
      }
    });
    return grouped;
  }, [links, categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const renderGroup = (id: string, title: string, groupLinks: Link[]) => {
    const isOpen = openCategories.has(id);

    return (
      <div key={id} className={styles.categoryGroup}>
        <button
          type="button"
          className={`${styles.categoryHeader} ${isOpen ? styles.categoryHeaderOpen : ""}`}
          onClick={() => toggleCategory(id)}
        >
          <div className={styles.categoryTitle}>
            {title}
            <span className={styles.categoryCount}>
              {groupLinks.length} {groupLinks.length === 1 ? "link" : "links"}
            </span>
          </div>
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div
          className={`${styles.categoryContent} ${
            isOpen ? styles.categoryContentOpen : ""
          }`}
        >
          <div className={styles.categoryContentInner}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={groupLinks.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.linksList}>
                  {groupLinks.length === 0 ? (
                    <div className={styles.emptyCategory}>
                      Nenhum link nesta categoria.
                    </div>
                  ) : (
                    groupLinks.map((link) => (
                      <SortableLinkItem
                        key={link.id}
                        link={link}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onActivate={onActivate}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.linksListContainer}
      style={{
        opacity: isReordering || isActivating ? 0.7 : 1,
        pointerEvents: isReordering ? "none" : "auto",
      }}
    >
      <div className={styles.categoryGroupsList}>
        {categories.map((cat) => renderGroup(cat.id, cat.name, linksByCategory[cat.id]))}

        {linksByCategory["uncategorized"].length > 0 &&
          renderGroup("uncategorized", "Sem categoria", linksByCategory["uncategorized"])}
      </div>
    </div>
  );
}
