import { useState, useEffect, useRef } from "react";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchControls from "./SearchControls";

// `bottom` and `paddingBottom` are applied dynamically via sx to respond to the
// virtual keyboard across all mobile browsers — see the useEffect below.
const BottomBar = styled(Box)(({ theme }) => ({
    position: "fixed",
    left: 0,
    right: 0,
    zIndex: 1100,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `linear-gradient(${theme.palette.background.paper}e6, ${theme.palette.background.paper}e6)`,
    backdropFilter: "blur(12px)",
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(1.25),
    display: "flex",
    alignItems: "center",
    // Smooth slide in sync with keyboard open/close animation
    transition: "bottom 80ms linear",

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
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Snapshot the page height before any keyboard has opened.
    // Used as a fallback for Android browsers that shrink window.innerHeight
    // directly rather than only shrinking the visual viewport.
    const initialInnerHeight = useRef(window.innerHeight);

    useEffect(() => {
        const vv = window.visualViewport;

        const computeKeyboardHeight = (): number => {
            if (vv) {
                // ── Primary path ──────────────────────────────────────────────
                // Visual Viewport API: works on iOS Safari, iOS Chrome/Firefox/
                // DuckDuckGo/Edge, Android Chrome 61+, Android Firefox 91+,
                // Samsung Internet 8.2+.
                //
                // On iOS:  window.innerHeight stays constant; vv.height shrinks.
                // On Android Chrome: both shrink, but vv is still the right source.
                // vv.offsetTop accounts for the page scrolling up when an input
                // inside the bar is focused.
                return Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
            }

            // ── Fallback path ─────────────────────────────────────────────────
            // Some older Android browsers (pre-Chrome 61, legacy WebViews) do not
            // expose visualViewport but do shrink window.innerHeight when the
            // keyboard opens. Compare against our pre-keyboard snapshot.
            return Math.max(0, initialInnerHeight.current - window.innerHeight);
        };

        const onViewportChange = () => setKeyboardHeight(computeKeyboardHeight());

        // Listen to visualViewport events (iOS + modern Android)
        if (vv) {
            vv.addEventListener("resize", onViewportChange);
            // "scroll" fires on iOS when the page is pushed up by auto-scroll
            vv.addEventListener("scroll", onViewportChange);
        }

        // window "resize" is a safety net that catches:
        //   • Android browsers that only fire window resize (not visualViewport)
        //   • Any browser quirks where vv events are delayed
        window.addEventListener("resize", onViewportChange);

        return () => {
            if (vv) {
                vv.removeEventListener("resize", onViewportChange);
                vv.removeEventListener("scroll", onViewportChange);
            }
            window.removeEventListener("resize", onViewportChange);
        };
    }, []);

    // When the keyboard is up, sit flush above it.
    // When it's hidden, restore the home-indicator safe area for notched devices
    // (requires viewport-fit=cover in the <meta name="viewport"> tag).
    const bottom = keyboardHeight;
    const paddingBottom =
        keyboardHeight > 0 ? "10px" : "calc(10px + env(safe-area-inset-bottom))";

    return (
        <BottomBar sx={{ bottom, paddingBottom }}>
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
