import React from "react";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Event } from "../types/event.types";
import { AbstractEventBackground } from "./AbstractEventBackground";
import { formatDate, formatTime } from "../utils/dateUtils";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const EventsGrid = styled(Grid)(() => ({
    maxWidth: 1000,
    marginLeft: "auto",
    marginRight: "auto",
}));

const EventCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    overflow: "hidden",

    [theme.breakpoints.up("md")]: {
        flexDirection: "row",
    },
}));

const EventImage = styled(CardMedia)(({ theme }) => ({
    width: "100%",
    height: 200,
    objectFit: "cover",

    [theme.breakpoints.up("md")]: {
        width: 300,
        height: "auto",
    },
}));

const EventContent = styled(CardContent)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(3),
}));

type EventListProps = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  onClearSearch: () => void;
  hasMore?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
};

const EventList = ({ events, isLoading, error, onClearSearch, hasMore, isFetchingMore, onLoadMore }: EventListProps) => {
  const sentinelRef = useIntersectionObserver(() => {
    if (hasMore && !isFetchingMore && onLoadMore) onLoadMore();
  }, { rootMargin: '800px' });

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
        <>
          <EventsGrid container spacing={4}>
            {events.map((event) => (
              <Grid size={12} key={event.id}>
                <EventCard>

                  {event.image ? (
                    <EventImage image={event.image} />
                  ) : (
                    <AbstractEventBackground event={event} />
                  )}

                  <EventContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {event.title}
                    </Typography>

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

          {/* Skeleton cards while next page loads */}
          {isFetchingMore && (
            <EventsGrid container spacing={4} sx={{ mt: 0 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Grid size={12} key={`skeleton-more-${i}`}>
                  <EventCard>
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

          {/* Invisible sentinel — unmounted while fetching to prevent stale IO fires */}
          {hasMore && !isFetchingMore && <Box ref={sentinelRef} sx={{ height: 1 }} />}
        </>
      )}
    </>
  );
};

export default React.memo(EventList);
