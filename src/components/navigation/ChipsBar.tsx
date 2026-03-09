import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { Box, Chip, Container, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
const ChipsBarWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
}));

const ScrollRow = styled(Box)({
    display: "flex",
    flexDirection: "row",
    gap: 8,
    overflowX: "auto",
    scrollbarWidth: "none",
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": { display: "none" },
});

const ArrowButton = styled(IconButton)(({ theme }) => ({
    flexShrink: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    width: 28,
    height: 28,
    padding: 0,
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

interface ChipsBarProps {
    categories: string[];
    selectedCategory: string | null;
    onCategorySelect: (category: string | null) => void;
}

const ChipsBar = ({ categories, selectedCategory, onCategorySelect }: ChipsBarProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const updateArrows = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setShowLeft(el.scrollLeft > 4);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    // Re-runs whenever categories change so the listener is always attached
    // to the newly mounted ScrollRow and the initial overflow state is correct.
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, [categories, updateArrows]);

    if (categories.length === 0) return null;

    const scroll = (direction: "left" | "right") => {
        scrollRef.current?.scrollBy({ left: direction === "left" ? -150 : 150 });
    };

    const handleClick = (category: string) => {
        onCategorySelect(selectedCategory === category ? null : category);
    };

    return (
        <ChipsBarWrapper>
            <Container sx={{ px: { xs: 1, md: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <ArrowButton onClick={() => scroll("left")} size="small" disabled={!showLeft}>
                        <PlayArrowRoundedIcon fontSize="small" sx={{ transform: "rotate(180deg)" }} />
                    </ArrowButton>

                    <ScrollRow ref={scrollRef} sx={{ flex: 1 }}>
                        <Chip
                            label="All"
                            size="small"
                            variant={selectedCategory === null ? "filled" : "outlined"}
                            color={selectedCategory === null ? "primary" : "default"}
                            onClick={() => onCategorySelect(null)}
                            sx={{ fontWeight: selectedCategory === null ? 700 : 400, flexShrink: 0 }}
                        />
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <Chip
                                    key={category}
                                    label={category}
                                    size="small"
                                    variant={isActive ? "filled" : "outlined"}
                                    color={isActive ? "primary" : "default"}
                                    onClick={() => handleClick(category)}
                                    sx={{ fontWeight: isActive ? 700 : 400, flexShrink: 0 }}
                                />
                            );
                        })}
                    </ScrollRow>

                    <ArrowButton onClick={() => scroll("right")} size="small" disabled={!showRight}>
                        <PlayArrowRoundedIcon fontSize="small" />
                    </ArrowButton>
                </Box>
            </Container>
        </ChipsBarWrapper>
    );
};

export default ChipsBar;
