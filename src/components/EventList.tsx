import React from "react";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Box, Button, CardActions, Chip, Skeleton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { ChipProps } from "@mui/material/Chip";
import { EventCard, EventContent, EventImage, EventsGrid } from "./EventList.styles";
import type { Event } from "../types/event.types";
import { AbstractEventBackground } from "./AbstractEventBackground";

type EventListProps = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  onClearSearch: () => void;
};

const getCategoryColor = (category: string): ChipProps["color"] => {
  const normalized = category.toLowerCase();

  if (normalized.includes("music") || normalized.includes("r&b")) {
    return "secondary";
  }

  if (normalized.includes("sport")) {
    return "success";
  }

  if (normalized.includes("comedy")) {
    return "warning";
  }

  if (normalized.includes("community") || normalized.includes("civic")) {
    return "info";
  }

  return "primary";
};

const EventList = ({ events, isLoading, error, onClearSearch }: EventListProps) => {
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

  //Helper to convert the date to Month DD, YYYY
  const formatDate = (dateString: string) => {
    const date = parseEventDate(dateString);
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };

  //Helper to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    // Ticketmaster localTime comes in "HH:mm:ss" format.
    // We attach a dummy date to create a valid Date object.
    const date = new Date(`1970-01-01T${timeString}`);

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <>
      {/* Loading State */}
      {isLoading && (
        <EventsGrid container spacing={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid size={12} key={index}>
              <EventCard>
                {/* Mirror real horizontal layout */}
                <EventImage>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </EventImage>

                <EventContent>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />

                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />

                  <CardActions sx={{ mt: 2, p: 0 }}>
                    <Skeleton variant="rectangular" width={120} height={36} />
                  </CardActions>
                </EventContent>
              </EventCard>
            </Grid>
          ))}
        </EventsGrid>
      )}
      {/* Error State */}
      {!isLoading && error && <p>Error: {error}</p>}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <Box
          sx={{
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Box>
            <SearchOffIcon
              sx={{
                fontSize: 64,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography variant="h5" gutterBottom>
              No events found
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Try searching for a different artist, city, or date.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 3 }}
              onClick={onClearSearch}
            >
              Clear Search
            </Button>
          </Box>
        </Box>
      )}

      {/* Data State */}
      {!isLoading && !error && events.length > 0 && (
        <EventsGrid
          container
          spacing={4}
        >
          {events.map((event) => (
            <Grid size={12} key={event.id}>
              <EventCard>

                {event.image ? (
                  <EventImage
                    image={event.image}
                  />
                ) : (
                  <AbstractEventBackground event={event} />
                )}

                <EventContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {event.title}
                  </Typography>

                  {event.categories.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                      {event.categories.slice(0, 2).map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          color={getCategoryColor(category)}
                          variant="filled"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Stack>
                  )}

                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {formatDate(event.date)}
                        {event.time && ` • ${formatTime(event.time)}`}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {event.venue}, {event.city}
                      </Typography>
                    </Stack>
                  </Stack>

                  <CardActions sx={{ mt: 2, p: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Event
                    </Button>
                  </CardActions>
                </EventContent>
              </EventCard>
            </Grid>
          ))}
        </EventsGrid>
      )}
    </>
  );
};

export default React.memo(EventList);