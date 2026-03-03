import React from "react";
import type { Event } from "../types/event.types";
import { CardActions, Typography, Button, Backdrop, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { EventsGrid, EventCard, EventImage, EventContent } from "./EventList.styles";

type EventListProps = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
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

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    {event.city}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    {formatDate(event.date)}
                  </Typography>

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