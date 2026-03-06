import { Chip, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { getCategoryColor, getRenderableCategories } from "../utils/eventCategories";

type EventCategoryChipsProps = {
  // Raw category labels from the event payload.
  categories: string[];
  // Limit how many chips appear (e.g., list cards show more than masonry tiles).
  maxVisible?: number;
  // Optional style overrides for the wrapping Stack.
  stackSx?: SxProps<Theme>;
  // Optional style overrides for each Chip.
  chipSx?: SxProps<Theme>;
};

export default function EventCategoryChips({
  categories,
  maxVisible = 2,
  stackSx,
  chipSx,
}: EventCategoryChipsProps) {
  // Remove placeholders/duplicates in a shared utility, then cap visible chips.
  const visibleCategories = getRenderableCategories(categories).slice(0, maxVisible);

  // Render nothing when there are no valid categories after cleanup.
  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", ...stackSx }}>
      {visibleCategories.map((category) => (
        <Chip
          key={category.toLowerCase()}
          label={category}
          size="small"
          // Keep category-to-color mapping consistent across all views.
          color={getCategoryColor(category)}
          variant="filled"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            ...chipSx,
          }}
        />
      ))}
    </Stack>
  );
}
