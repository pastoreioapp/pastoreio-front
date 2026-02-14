import { Box, Card } from "@mui/material";
import ReceiveCode from "../components/ReceiveCode";
import Image from "next/image";

export default function PageReceiveCode() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #5E79B3 0%, #7F99D2 100%)",
        px: { xs: 2.5, sm: 0 },
      }}
    >
      <Image src="/images/logos/logo-clara-degrade.svg" alt="Logo" width={300} height={100} />
      <Card
        elevation={9}
        sx={{
          p: { xs: 5, sm: 10 },
          width: "100%",
          maxWidth: "650px",
          backgroundColor: "#FFFFFF",
          borderRadius: "30px",
          my: { xs: 4, lg: 0 },
        }}
      >
        <ReceiveCode />
      </Card>
    </Box>
  );
}
