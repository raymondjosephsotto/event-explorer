import type { Event } from "../types/event.types";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type HeroProps = {
  events: Event[];
};

const Hero = ({ events }: HeroProps) => {
  // Return empty fragment if no events are available
  if (!events || events.length === 0) {
    return <></>;
  }

  return (
    <Box
      sx={{
        mb: 6,
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
        {events.slice(0, 5).map((event) => (
          <SwiperSlide key={event.id}>
            {({ isActive }) => (
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 340, md: 480 },
                  borderRadius: 3,
                  overflow: "hidden",
                  // Subtle scale effect when slide is active
                  transform: isActive ? "scale(1.01)" : "scale(1)",
                  transition: "transform 1400ms ease",
                }}
              >
                {/* Background image layer */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${event.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

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
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    height: "100%",
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: 1400,
                    mx: "auto",
                    px: { xs: 3, md: 6 },
                    color: "#fff",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(20px)",
                    transition: "all 900ms ease",
                  }}
                >
                  <Typography variant="h3" fontWeight={700}>
                    {event.title}
                  </Typography>

                  <Typography variant="body1">
                    {event.venue}, {event.city}
                  </Typography>

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
        ))}
      </Swiper>
    </Box>
  );
};

export default Hero;