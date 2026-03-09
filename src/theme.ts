import { createTheme } from "@mui/material";

// ── Brand Tokens ──
const brand = {
  orange:    "#F97316",  // Classic Orange — primary accent
  orangeDark:"#EA580C",  // Pressed / hover state
  orangeLight:"#FB923C", // Lighter tint for highlights

  bgDefault: "#0D1117",  // Deep black background
  bgSurface: "#161B22",  // Surface / panel
  bgElevated:"#1C2128",  // Elevated surface (cards, menus)
  border:    "#21262D",  // Subtle border
  borderHover:"#30363D", // Hovered border

  textPrimary:  "#E6EDF3",
  textSecondary:"#8B949E",
  textMuted:    "#6E7681",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main:  brand.orange,
      dark:  brand.orangeDark,
      light: brand.orangeLight,
      contrastText: "#fff",
    },
    background: {
      default: brand.bgDefault,
      paper:   brand.bgSurface,
    },
    divider: brand.border,
    text: {
      primary:   brand.textPrimary,
      secondary: brand.textSecondary,
    },
  },

  typography: {
    fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700, letterSpacing: "-0.01em" },
    body1: { letterSpacing: "-0.005em" },
    body2: { letterSpacing: "0" },
    button: { fontWeight: 600, textTransform: "none" as const, letterSpacing: "0.01em" },
  },

  shape: { borderRadius: 8 },

  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: brand.orange,
          color: "#fff",
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            backgroundColor: brand.orangeDark,
            boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
          },
        },
        outlined: {
          borderColor: brand.border,
          color: brand.textPrimary,
          "&:hover": {
            borderColor: brand.orange,
            backgroundColor: "rgba(249,115,22,0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: brand.bgElevated,
          borderRadius: 12,
          border: `1px solid ${brand.border}`,
          backgroundImage: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            borderColor: brand.borderHover,
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: "0.8125rem",
        },
        outlined: {
          borderColor: brand.border,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: brand.border,
            },
            "&:hover fieldset": {
              borderColor: brand.borderHover,
            },
            "&.Mui-focused fieldset": {
              borderColor: brand.orange,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${brand.borderHover} ${brand.bgDefault}`,
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-track": { background: brand.bgDefault },
          "&::-webkit-scrollbar-thumb": {
            background: brand.borderHover,
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export default darkTheme;
