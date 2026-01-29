"use client";

import { observer } from "mobx-react-lite";
import { Card } from "antd";
import { menuStore } from "@/stores";
import styles from "./CategoryList.module.css";

interface CategoryListProps {
  onSelect: (id: string | null) => void;
}

export const CategoryList = observer(function CategoryList({
  onSelect,
}: CategoryListProps) {
  const { categories, selectedCategoryId } = menuStore;

  return (
    <div className={styles.wrap}>
      <Card
        size="small"
        className={selectedCategoryId === null ? styles.cardSelected : styles.card}
        onClick={() => onSelect(null)}
      >
        Все
      </Card>
      {categories.map((c) => (
        <Card
          key={c.id}
          size="small"
          className={
            selectedCategoryId === c.id ? styles.cardSelected : styles.card
          }
          onClick={() => onSelect(c.id)}
        >
          {c.title}
        </Card>
      ))}
    </div>
  );
});
