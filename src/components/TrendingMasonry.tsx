import { Box, Typography, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import type { Event } from "../types/event.types";
import EventCategoryChips from "./EventCategoryChips";

interface TrendingMasonryProps {
  events: Event[];
  location?: string;
}

export default function TrendingMasonry({ events, location }: TrendingMasonryProps) {
  if (!events || events.length === 0) return null;

  const parseEventDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
    if (dateOnlyMatch) {
      const [, y, m, d] = dateOnlyMatch;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }

    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} sx={{
        mb: 4, fontSize: {
          xs: "1.25rem",
          md: "2.25rem",
        }
      }}>
        {location ? `Trending Events in ${location}` : "Trending Events"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 3,
          gridAutoRows: 160,
          gridAutoFlow: "dense",
        }}
      >
        {events.map((event, index) => {
          const rowSpan = index % 5 === 0 ? 3 : index % 3 === 0 ? 2 : 1;
          const parsedDate = parseEventDate(event.date);
          const formattedDate = parsedDate
            ? parsedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "";

          return (
            <Box
              key={event.id}
              component="a"
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                gridColumn: "span 1",
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
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {event.image ? (
                  <Box
                    component="img"
                    src={event.image}
                    alt={event.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                    }}
                  />
                )}
              </Box>

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
                <EventCategoryChips
                  categories={event.categories}
                  maxVisible={1}
                  stackSx={{ mb: 1 }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.2,
                    paddingBottom: 1.5,
                  }}
                >
                  {event.title}
                </Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <EventIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.75,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {formattedDate}
                    {event.time
                      ? ` • ${new Date(`1970-01-01T${event.time}`).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "2-digit" }
                      )}`
                      : ""}
                  </Typography>
                </Stack>

                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LocationOnIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.85,
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {event.venue}
                    </Typography>
                  </Stack>

                </Stack>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}