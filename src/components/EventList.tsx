import React from "react";
import type { Event } from "../types/event.types";
import { Card, CardActions, CardContent, CardMedia, Grid, Typography, Button, Backdrop, CircularProgress } from "@mui/material";

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
        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          {events.map((event) => (
            <Grid size={{ xs: 12 }} key={event.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "stretch",
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardMedia
                  component="img"
                  image={event.image}
                  alt={event.title}
                  sx={{
                    width: { xs: "100%", md: 300 },
                    height: { xs: 200, md: "auto" },
                    objectFit: "cover",
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    p: 3,
                  }}
                >
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default React.memo(EventList);