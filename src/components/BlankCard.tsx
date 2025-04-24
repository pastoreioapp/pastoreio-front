import { Card } from "@mui/material";

type Props = {
    className?: string;
    children: JSX.Element | JSX.Element[];
};

export default function BlankCard({ children, className }: Props) {
    return (
        <Card
            sx={{ p: 0, position: "relative" }}
            className={className}
            elevation={9}
            variant={undefined}
        >
            {children}
        </Card>
    );
}
