import { Box, Card } from "@mui/material";
import PainelLogin from "./components/PainelLogin";
import PainelApresentacao from "../components/PainelApresentacao";

export default function LoginPage() {
  return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(180deg, #5E79B3 0%, #7F99D2 100%)",
        }}
      >
        <Card
          elevation={9}
          sx={{
            p: { xs: 5, sm: 7 },
            width: "100%",
            maxWidth: "550px",
            backgroundColor: "#EFF4FF",
            borderRadius: "30px",
            my: { xs: 4, lg: 0 },
          }}
        >
          <PainelLogin />
        </Card>
      </Box>
  );
}
