import { Box, Card } from "@mui/material";
import PageContainer from "@/ui/components/pages/PageContainer";
import RecoverPassword from "../components/RecoverPassword";
import PainelApresentacao from "../components/PainelApresentacao";

export default function RecoverPage() {
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
          <PainelApresentacao />
        </Box>

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
            <RecoverPassword />
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
}
