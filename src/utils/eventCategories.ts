import type { ChipProps } from "@mui/material/Chip";

const HIDDEN_CATEGORIES = new Set(["uncategorized", "undefined", "other"]);

const normalizeCategory = (category: string): string => category.trim().replace(/\s+/g, " ").toLowerCase();

export const getCategoryColor = (category: string): ChipProps["color"] => {
  const normalized = normalizeCategory(category);

  if (normalized.includes("music") || normalized.includes("r&b")) {
    return "secondary";
  }

  if (normalized.includes("sport")) {
    return "success";
  }

  if (normalized.includes("comedy")) {
    return "warning";
  }

  if (normalized.includes("community") || normalized.includes("civic")) {
    return "info";
  }

  return "primary";
};

export const getRenderableCategories = (categories: string[]): string[] => {
  const uniqueCategories: string[] = [];
  const seen = new Set<string>();

  categories.forEach((category) => {
    const cleaned = category.trim().replace(/\s+/g, " ");

    if (!cleaned) return;

    const normalized = normalizeCategory(cleaned);
    if (HIDDEN_CATEGORIES.has(normalized) || seen.has(normalized)) return;

    seen.add(normalized);
    uniqueCategories.push(cleaned);
  });

  return uniqueCategories;
};
