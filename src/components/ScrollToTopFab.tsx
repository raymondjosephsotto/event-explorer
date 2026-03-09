import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useScrolledDown } from "../hooks/useScrolledDown";

const FabContainer = styled(Box)(({ theme }) => ({
    position: "fixed",
    right: theme.spacing(2),
    zIndex: 1000,

    // Mobile: float above the browser's bottom chrome
    bottom: `calc(env(safe-area-inset-bottom) + 16px)`,

    [theme.breakpoints.up("md")]: {
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
}));

const ScrollToTopFab = () => {
    const scrolledDown = useScrolledDown();

    return (
        <FabContainer
            sx={{
                opacity: scrolledDown ? 1 : 0,
                pointerEvents: scrolledDown ? "auto" : "none",
                transition: "opacity 0.3s ease",
            }}
        >
            <Tooltip title="Scroll to top" placement="left">
                <IconButton
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="scroll to top"
                    sx={{
                        backgroundColor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        "&:hover": {
                            backgroundColor: "action.hover",
                            borderColor: "primary.main",
                        },
                    }}
                >
                    <KeyboardArrowUpRoundedIcon />
                </IconButton>
            </Tooltip>
        </FabContainer>
    );
};

export default ScrollToTopFab;
