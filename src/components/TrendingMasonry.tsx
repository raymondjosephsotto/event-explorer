import { Box, Typography, Chip } from "@mui/material";
import type { Event } from "../types/event.types";

interface TrendingMasonryProps {
  events: Event[];
}

export default function TrendingMasonry({ events }: TrendingMasonryProps) {
  if (!events || events.length === 0) return null;

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Trending Events
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          gridAutoRows: 160,
          gridAutoFlow: "dense",
        }}
      >
        {events.map((event, index) => {
          const columnSpan = index % 7 === 0 ? 2 : 1;
          const rowSpan = index % 5 === 0 ? 3 : index % 3 === 0 ? 2 : 1;

          return (
            <Box
              key={event.id}
              component="a"
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                gridColumn: `span ${columnSpan}`,
                gridRow: `span ${rowSpan}`,
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                textDecoration: "none",
                transition: "transform 300ms ease, box-shadow 300ms ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                },
              }}
            >
              <Box
                component="img"
                src={event.image}
                alt={event.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  p: 2,
                  color: "#fff",
                }}
              >
                {event.categories &&
                  event.categories.length > 0 &&
                  !["Other", "Undefined"].includes(event.categories[0]) && (
                    <Chip
                      label={event.categories[0]}
                      size="small"
                      sx={{
                        mb: 1,
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        backdropFilter: "blur(6px)",
                        alignSelf: "flex-start",
                        width: "fit-content",
                      }}
                    />
                  )}

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.title}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {event.venue} • {event.date}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}