'use client'

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

const ImageCarousel = ({
  images,
  autoPlay = false,
  interval = 3000,
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [activeIndex, autoPlay, interval]);

  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      
      {/* Imagens do carrossel */}
      <img
        src={images[activeIndex]}
        alt={`Slide ${activeIndex}`}
        style={{ width: "100%", height: "auto", display: "block", marginBottom: "30px"}}
      />

      {/* Texto */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%"
        }}
      >
        <Typography variant="h6" textAlign="center" mb={5} mt={5}>
          O digital à serviço do evangelho: <br /> alcançando, transformando e
          cuidando de vidas.
        </Typography>
      </Box>

      {/* Indicadores */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: 100,
              height: 8,
              borderRadius: "10px",
              bgcolor: index === activeIndex ? "primary.main" : "#96A8D0",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageCarousel;
