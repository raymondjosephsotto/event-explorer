import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, Stack, Box, IconButton, Menu, Tooltip } from "@mui/material";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Filters from "./Filters";

const SORT_OPTIONS = [
    { value: "date,asc", label: "Date Ascending" },
    { value: "date,desc", label: "Date Descending" },
    { value: "name,asc", label: "Name Ascending" },
];

interface SearchControlsProps {
    query: string;
    handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sort: string;
    setSort: (value: string) => void;
}

const SearchControls = ({ query, handleQueryChange, sort, setSort }: SearchControlsProps) => {
    const showSort = query.trim().length > 0;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <Stack direction="row" alignItems="center" sx={{
            width: "100%",
        }}>
            <Box sx={{ flex: 1, transition: "flex 0.3s ease" }}>
                <Filters query={query} handleQueryChange={handleQueryChange} />
            </Box>

            {/* Mobile: icon button + popover menu */}
            <Box sx={{
                display: { xs: "flex", md: "none" },
                flexShrink: 0,
                width: showSort ? "40px" : 0,
                marginLeft: showSort ? "12px" : 0,
                opacity: showSort ? 1 : 0,
                overflow: "hidden",
                pointerEvents: showSort ? "auto" : "none",
                transition: "width 0.3s ease, opacity 0.3s ease, margin-left 0.3s ease",
            }}>
                <Tooltip title="Sort">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" color={sort !== "date,asc" ? "primary" : "default"}>
                        <SortRoundedIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    {SORT_OPTIONS.map((option) => (
                        <MenuItem
                            key={option.value}
                            selected={sort === option.value}
                            onClick={() => { setSort(option.value); setAnchorEl(null); }}
                            sx={{ gap: 1 }}
                        >
                            <Box sx={{ width: 20, display: "flex", alignItems: "center" }}>
                                {sort === option.value && <CheckRoundedIcon fontSize="small" color="primary" />}
                            </Box>
                            {option.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            {/* Desktop: Select dropdown */}
            <Box sx={{
                display: { xs: "none", md: "block" },
                flexShrink: 0,
                width: showSort ? "200px" : 0,
                marginLeft: showSort ? "12px" : 0,
                opacity: showSort ? 1 : 0,
                clipPath: "inset(-20px 0px 0px 0px)",
                transition: "width 0.3s ease, opacity 0.3s ease, margin-left 0.3s ease",
            }}>
                <FormControl fullWidth size="small">
                    <InputLabel id="sort-label" htmlFor="sort-select">
                        Sort By
                    </InputLabel>
                    <Select
                        id="sort-select"
                        labelId="sort-label"
                        value={sort}
                        label="Sort By"
                        onChange={(event) => setSort(event.target.value)}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Stack>
    );
};

export default SearchControls;
