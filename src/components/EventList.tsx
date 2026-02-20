import type { Event } from "../types/event.types";
import { Card, CardActions, CardContent, CardMedia, LinearProgress, Grid, Typography, Button } from "@mui/material";

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

      {/* Loading State */}
      {isLoading && (
        <>
          <p>Loading events...</p>
          <br />
          <LinearProgress />
        </>
      )}

      {/* Error State */}
      {!isLoading && error && <p>Error: {error}</p>}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <p>No events found.</p>
      )}

      {/* Data State */}
      {!isLoading && !error && events.length > 0 && (
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={event.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography gutterBottom variant="body1">City: {event.city}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatDate(event.date)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" href={event.url} target="_blank" rel="noopener noreferrer">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default EventList;