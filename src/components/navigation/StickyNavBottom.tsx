import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchControls from "./SearchControls";

const BottomBar = styled(Box)(({ theme }) => ({
    position: "fixed",
    // Pure-CSS keyboard avoidance — no JavaScript required.
    //
    // 100vh  = layout viewport height (stays constant on iOS when keyboard opens)
    // 100dvh = dynamic viewport height (shrinks by exactly the keyboard height)
    //
    // Result: bottom equals 0 when keyboard is closed, and equals the keyboard
    // height when it is open, lifting the bar flush above it automatically.
    // On browsers without dvh support the value resolves to 0 (safe fallback).
    bottom: "calc(100vh - 100dvh)",
    left: 0,
    right: 0,
    zIndex: 1100,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `linear-gradient(${theme.palette.background.paper}e6, ${theme.palette.background.paper}e6)`,
    backdropFilter: "blur(12px)",
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(1.25),
    // env(safe-area-inset-bottom) covers the home indicator on notched iPhones.
    // When the keyboard is open the home indicator is hidden, so the env value
    // resolves to 0 automatically — no conditional logic needed.
    paddingBottom: `calc(${theme.spacing(1.25)} + env(safe-area-inset-bottom))`,
    display: "flex",
    alignItems: "center",

    // Hidden on desktop
    [theme.breakpoints.up("md")]: {
        display: "none",
    },
}));

interface StickyNavBottomProps {
    query: string;
    handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sort: string;
    setSort: (value: string) => void;
}

const StickyNavBottom = ({ query, handleQueryChange, sort, setSort }: StickyNavBottomProps) => {
    return (
        <BottomBar>
            <Container>
                <SearchControls
                    query={query}
                    handleQueryChange={handleQueryChange}
                    sort={sort}
                    setSort={setSort}
                />
            </Container>
        </BottomBar>
    );
};

export default StickyNavBottom;
