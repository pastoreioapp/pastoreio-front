"use client";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { ProtectedRoute } from "./ProtectedRoute";

type Props = {
    description?: string;
    children: JSX.Element | JSX.Element[];
    title?: string;
    allowedRoles?: string[];
};

export default function PageContainer({ title, description, children, allowedRoles }: Props) {
    return (
        <ProtectedRoute allowedRoles={allowedRoles}>
            <HelmetProvider>
                <div>
                    <Helmet>
                        <title>{title}</title>
                        <meta name="description" content={description} />
                    </Helmet>
                    {children}
                </div>
            </HelmetProvider>
        </ProtectedRoute>
    );
}
