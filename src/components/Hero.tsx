import type { Event } from "../types/event.types";
import { Box, Button, Stack, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type HeroProps = {
  events: Event[];
};

const Hero = ({ events }: HeroProps) => {
  // Helper: Format date like "October 20, 2025"
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Helper: Format time like "7:30 PM"
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const date = new Date(`1970-01-01T${timeString}`);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };
  // Return empty fragment if no events are available
  if (!events || events.length === 0) {
    return <></>;
  }

  return (
    <Box
      sx={{
        // Style inactive pagination bullets with transparent white background
        "& .swiper-pagination-bullet": {
          backgroundColor: "rgba(255,255,255,0.4)",
          opacity: 1,
          width: 8,
          height: 8,
          transition: "all 300ms ease",
        },
        // Active bullet expands horizontally and becomes fully opaque
        "& .swiper-pagination-bullet-active": {
          backgroundColor: "#fff",
          width: 22,
          borderRadius: 4,
        },
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        // Enable clickable pagination dots for manual navigation
        pagination={{ clickable: true }}
        // Auto-rotate slides every 5 seconds, pause on hover
        autoplay={{
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1400}
        // Loop back to first slide after the last one
        loop
      >
        {/* Display only the first 5 events in the carousel */}
        {events.slice(0, 5).map((event) => {
          const formattedDate = formatDate(event.date);
          const formattedTime = formatTime(event.time);

          return (
            <SwiperSlide key={event.id}>
              {({ isActive }) => (
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 420, md: 480 },
                    borderRadius: 3,
                    overflow: "hidden",
                    // Subtle scale effect when slide is active
                    transform: isActive ? "scale(1.01)" : "scale(1)",
                    transition: "transform 1400ms ease",
                  }}
                >
                  {/* Background image layer */}
                  {event.image ? (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        background:
                          "linear-gradient(135deg, #1f2937 0%, #4c1d95 50%, #7e22ce 100%)",
                      }}
                    />
                  )}

                  {/* Dark gradient overlay for text readability */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: `
                      linear-gradient(
                        to right,
                        rgba(0,0,0,0.9) 0%,
                        rgba(0,0,0,0.75) 35%,
                        rgba(0,0,0,0.2) 70%,
                        rgba(0,0,0,0) 100%
                      )
                    `,
                    }}
                  />

                  {/* Event content positioned over image and gradient */}
                  <Stack
                    spacing={2}
                    maxWidth={1400}
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      height: "100%",
                      justifyContent: "center",
                      width: "100%",
                      maxWidth: "85%",
                      mx: "auto",
                      px: { xs: 3, md: 6 },
                      color: "#fff",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(20px)",
                      transition: "all 900ms ease",
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} sx={{
                      fontSize: {
                        xs: "1.8rem",
                        sm: "2.2rem",
                        md: "2.8rem",
                        lg: "3.5rem",
                      }
                    }}>
                      {event.title}
                    </Typography>

                    <Stack>

                      {/* Date & Time row */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EventIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body1">
                          {formattedDate}
                          {formattedTime ? ` • ${formattedTime}` : ""}
                        </Typography>
                      </Stack>

                      {/* Venue row */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body1">
                          {event.venue}, {event.city}
                        </Typography>
                      </Stack>

                    </Stack>

                    <Button
                      variant="contained"
                      href={event.url}
                      target="_blank"
                      sx={{ width: "fit-content" }}
                    >
                      View Event
                    </Button>
                  </Stack>
                </Box>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default Hero;