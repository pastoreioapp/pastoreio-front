import Link from "next/link";
import Image from "next/image";
import { Box } from "@mui/material";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";

export default function LeftContent() {
  return (
    <section>
      {/* Logo */}
      <Box sx={{ position: "absolute", top: 0, left: 0, padding: 4 }}>
        <Link href={"/dashboard"}>
          <Image
            src="/images/logos/logo-horizontal.svg"
            alt="Google Login"
            width={230}
            height={60}
            unoptimized
          />
        </Link>
      </Box>

      {/* Carrossel de Imagens */}
      <Box sx={{ width: "100%", maxWidth: "650px", mb: 4 }}>
        <ImageCarousel
          images={[
            "/images/Carousel/image.svg",
            "/images/Carousel/image.svg",
            "/images/Carousel/image.svg",
          ]}
          autoPlay={true}
        />
      </Box>
    </section>
  );
}
