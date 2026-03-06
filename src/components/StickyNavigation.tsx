import { Container, Stack, FormControl, InputLabel, Select, MenuItem, Typography, Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SearchContainer, SortContainer } from "../containers/EventExplorer.styles";
import Filters from "./Filters";
import logo from "../assets/event-explorer-logo.svg";

// Sticky navigation wrapper
const StickyNav = styled(Box)(({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: 1100,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

interface StickyNavigationProps {
    query: string;
    handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sort: string;
    setSort: (value: string) => void;
}

const StickyNavigation = ({ query, handleQueryChange, sort, setSort }: StickyNavigationProps) => {
    return (
        <StickyNav>
            <Container>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 1.5, md: 3 }}
                    alignItems={{ md: "center" }}
                >
                    {/* Logo + Title */}
                    <Link 
                        href={import.meta.env.BASE_URL} 
                        underline="none" 
                        color="inherit"
                        sx={{ 
                            display: 'flex',
                            justifyContent: { xs: "center", md: "flex-start" },
                            width: { xs: '100%', md: 'auto' },
                            '&:hover': {
                                opacity: 0.8,
                            },
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
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
                                    fontFamily: '"Helvetica Neue"',
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    letterSpacing: -0.5,
                                    fontSize: {
                                        xs: 18,
                                        md: 20,
                                    }
                                }}
                            >
                                Event Explorer
                            </Typography>
                        </Stack>
                    </Link>

                    {/* Search Bar + Select Dropdown */}
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: query.trim().length > 0 ? 2 : 0, md: 2 }}
                        alignItems={{ md: "center" }}
                        sx={{ flex: { md: 1 }, maxWidth: { md: "70%" } }}
                    >
                        <SearchContainer hasQuery={query.trim().length > 0}>
                            <Filters
                                query={query}
                                handleQueryChange={handleQueryChange}
                            />
                        </SearchContainer>

                        <SortContainer hasQuery={query.trim().length > 0}>
                            <FormControl
                                fullWidth
                                sx={{
                                    minWidth: { md: 220 },
                                }}
                            >
                                <InputLabel id="sort-label" htmlFor="sort-select">
                                    Sort By
                                </InputLabel>
                                <Select
                                    id="sort-select"
                                    labelId="sort-label"
                                    value={sort}
                                    label="Sort By"
                                    onChange={(event) =>
                                        setSort(event.target.value)
                                    }
                                >
                                    <MenuItem value="date,asc">
                                        Date Ascending
                                    </MenuItem>
                                    <MenuItem value="date,desc">
                                        Date Descending
                                    </MenuItem>
                                    <MenuItem value="name,asc">
                                        Name Ascending
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </SortContainer>
                    </Stack>

                </Stack>
            </Container>
        </StickyNav>
    );
};

export default StickyNavigation;
