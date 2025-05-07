import Link from "next/link";
import Image from "next/image";
import { Box, Card, Stack, Typography } from "@mui/material";
import PageContainer from "@/components/PageContainer";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import ReceiveCode from "../components/ReceiveCode";
import { wrap } from "module";

export default function PageReceiveCode() {
  return (
    <PageContainer
      title="Recuperar Senha | Pastore.io"
      description="Recuperar Senha"
    >
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          backgroundColor: "#EFF4FF",
        }}
      >
        {/* Parte Esquerda */}
        <Box
          sx={{
            width: { xs: 0, lg: "45%" },
            height: { xs: 0, lg: "100vh" },
            overflow: "hidden",
            display: { xs: "none", lg: "flex" },
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "#173D8A",
            padding: 4,
            transition: "all 0.3s ease",
          }}
        >
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
                "/images/Carousel/image.png",
                "/images/Carousel/image.png",
                "/images/Carousel/image.png",
              ]}
              autoPlay={true}
            />
          </Box>
        </Box>

        {/* Parte Direita */}
        <Box
          sx={{
            width: { xs: "100%", lg: "55%" },
            height: { xs: "auto", lg: "100vh" },
            minHeight: { xs: "100vh", lg: "auto" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
            p: { xs: 2, sm: 4 },
            borderRadius: "30px 0px 0px 30px",
          }}
        >
          <Card
            elevation={9}
            sx={{
              p: { xs: 3, sm: 6 },
              py: { xs: 5, sm: 6 },
              width: "100%",
              maxWidth: "550px",
              backgroundColor: "#EFF4FF",
              borderRadius: "30px",
              my: { xs: 4, lg: 0 },
            }}
          >
            <ReceiveCode
              subtitle={
                <Typography variant="h3" textAlign="center" fontWeight="900">
                  Recuperar senha
                </Typography>
              }
              subtext={
                <Stack
                  width={"100%"}
                  display={"flex"}
                  alignContent={"center"}
                  alignItems={"center"}
                  direction="row"
                  justifyContent="center"
                  flexWrap={"wrap"}
                  textAlign={"center"}
                  spacing={1}
                  p={1}
                  mb={10}
                  color={"#173D8A"}
                >
                  <Typography variant="body1" fontWeight="600">
                    Enviamos um código para pasto******@gmail.com
                  </Typography>
                </Stack>
              }
              subtext2={
                <Stack
                  direction="row"
                  justifyContent="center"
                  flexWrap={"wrap"}
                  spacing={1}
                  mt={1}
                >
                  <Typography variant="body1" fontWeight="400">
                    Não recebeu o código ?
                  </Typography>
                  <Typography
                    variant="body1"
                    component={Link}
                    href="/auth/receiveCode"
                    fontWeight="700"
                    sx={{
                      textDecoration: "underline",
                      color: "#173D8A",
                    }}
                  >
                    Reenviar 30s
                  </Typography>
                </Stack>
              }
            />
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
}
