"use client";

import { useEffect, type ReactNode } from "react";
import { ProtectedRoute } from "../auth/ProtectedRoute";

type Props = {
    description?: string;
    children: ReactNode;
    title?: string;
    allowedRoles?: readonly string[];
};

export default function PageContainer({ title, description, children, allowedRoles }: Props) {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (!description) return;

        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.setAttribute("name", "description");
            document.head.appendChild(metaDescription);
        }

        metaDescription.setAttribute("content", description);
    }, [description, title]);

    return (
        <ProtectedRoute allowedRoles={allowedRoles}>
            <>{children}</>
        </ProtectedRoute>
    );
}
