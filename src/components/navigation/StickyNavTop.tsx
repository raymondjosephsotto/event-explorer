import { Container, Stack, Typography, Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchControls from "./SearchControls";
import ChipsBar from "./ChipsBar";
import logo from "../../assets/event-explorer-logo.svg";

const StickyTopBar = styled(Box)(({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: 1100,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    backdropFilter: "blur(12px)",
    backgroundImage: `linear-gradient(${theme.palette.background.paper}e6, ${theme.palette.background.paper}e6)`,
}));

interface StickyNavTopProps {
    query: string;
    handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sort: string;
    setSort: (value: string) => void;
    categories: string[];
    selectedCategory: string | null;
    onCategorySelect: (category: string | null) => void;
}

const StickyNavTop = ({ query, handleQueryChange, sort, setSort, categories, selectedCategory, onCategorySelect }: StickyNavTopProps) => {
    return (
        <StickyTopBar>
            <Container sx={{ py: 1.5 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 0, md: 3 }}
                    alignItems={{ md: "center" }}
                >
                    {/* Logo */}
                    <Link
                        href={import.meta.env.BASE_URL}
                        underline="none"
                        color="inherit"
                        sx={{
                            display: "flex",
                            justifyContent: { xs: "center", md: "flex-start" },
                            width: { xs: "100%", md: "auto" },
                            "&:hover": { opacity: 0.8 },
                            transition: "opacity 0.2s ease",
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                component="img"
                                src={logo}
                                alt="Event Explorer Logo"
                                sx={{ height: { xs: 35, md: 50 } }}
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontWeight: 700,
                                    color: "inherit",
                                    textDecoration: "none",
                                    letterSpacing: "-0.02em",
                                    fontSize: { xs: 18, md: 20 },
                                }}
                            >
                                Event Explorer
                            </Typography>
                        </Stack>
                    </Link>

                    {/* SearchControls — desktop only */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, flex: 1 }}>
                        <SearchControls
                            query={query}
                            handleQueryChange={handleQueryChange}
                            sort={sort}
                            setSort={setSort}
                        />
                    </Box>
                </Stack>
            </Container>
            <ChipsBar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={onCategorySelect}
            />
        </StickyTopBar>
    );
};

export default StickyNavTop;
