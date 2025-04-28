import DashboardCard from "@/components/DashboardCard";
import PageContainer from "@/components/PageContainer";

export default function Icons() {
    return (
        <PageContainer title="Icons" description="this is Icons">
            <DashboardCard title="Icons">
                <iframe
                    src="https://tabler-icons.io/"
                    title="Inline Frame Example"
                    width="100%"
                    height="650"
                ></iframe>
            </DashboardCard>
        </PageContainer>
    );
}
