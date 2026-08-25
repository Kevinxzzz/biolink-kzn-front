"use client";

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
import { SortableLinkItem } from "./SortableLinkItem";
import styles from "./LinksList.module.scss";

interface LinksListProps {
  links: Link[];
  isReordering: boolean;
  isActivating: boolean;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
  onActivate: (link: Link) => void;
}

export function LinksList({
  links,
  isReordering,
  isActivating,
  onDragEnd,
  onEdit,
  onDelete,
  onActivate,
}: LinksListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div
      className={styles.linksListContainer}
      style={{
        opacity: isReordering || isActivating ? 0.7 : 1,
        pointerEvents: isReordering ? "none" : "auto",
      }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.linksList}>
            {links.map((link) => (
              <SortableLinkItem
                key={link.id}
                link={link}
                onEdit={onEdit}
                onDelete={onDelete}
                onActivate={onActivate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
