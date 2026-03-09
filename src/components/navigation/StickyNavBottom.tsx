import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchControls from "./SearchControls";

const BottomBar = styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `linear-gradient(${theme.palette.background.paper}e6, ${theme.palette.background.paper}e6)`,
    backdropFilter: "blur(12px)",
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(1.25),
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
