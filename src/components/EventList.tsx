import React from "react";
import type { Event } from "../types/event.types";
import { CardActions, Typography, Button, Backdrop, CircularProgress, Stack, Chip } from "@mui/material";
import type { ChipProps } from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { EventsGrid, EventCard, EventImage, EventContent } from "./EventList.styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";

type EventListProps = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
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

const EventList = ({ events, isLoading, error }: EventListProps) => {
  //Helper to convert the date to Month DD, YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };

  //Helper to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <>
      {/* Loading Overlay */}
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6">
          Loading events...
        </Typography>
      </Backdrop>

      {/* Error State */}
      {!isLoading && error && <p>Error: {error}</p>}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <p>No events found.</p>
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
                <EventImage
                  image={event.image}
                />

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