const HIDDEN_CATEGORIES = new Set(["uncategorized", "undefined", "other"]);

const normalizeCategory = (category: string): string => category.trim().replace(/\s+/g, " ").toLowerCase();

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
