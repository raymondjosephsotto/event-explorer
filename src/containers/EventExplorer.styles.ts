import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasQuery",
})<{ hasQuery: boolean }>(({ theme, hasQuery }) => ({
  flexGrow: 1,
  transition:
    "flex-basis 360ms cubic-bezier(0.4, 0, 0.2, 1), max-width 360ms cubic-bezier(0.4, 0, 0.2, 1)",

  [theme.breakpoints.up("md")]: {
    flexBasis: hasQuery ? "calc(100% - 260px)" : "100%",
    maxWidth: hasQuery ? "calc(100% - 260px)" : "100%",
  },
}));

export const SortContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasQuery",
})<{ hasQuery: boolean }>(({ theme, hasQuery }) => ({
  display: "block",
  flexShrink: 0,
  transition:
    "max-height 300ms ease, flex-basis 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease",

  // Mobile accordion animation
  overflow: hasQuery ? "visible" : "hidden",
  maxHeight: hasQuery ? 120 : 0,

  [theme.breakpoints.up("md")]: {
    overflow: "visible",
    maxHeight: "none",
    flexBasis: hasQuery ? 260 : 0,
    maxWidth: hasQuery ? 260 : 0,
    opacity: hasQuery ? 1 : 0,
    pointerEvents: hasQuery ? "auto" : "none",
  },
}));

// Shared centered content wrapper (used for Hero inner content, Trending, Events)
export const PageContentWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 1400,
  margin: "0 auto",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),

  [theme.breakpoints.up("md")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));