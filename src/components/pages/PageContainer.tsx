"use client";

import { Helmet } from "react-helmet-async";

type Props = {
    description?: string;
    children: JSX.Element | JSX.Element[];
    title?: string;
};

export default function PageContainer({ title, description, children }: Props) {
    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>
            {children}
        </div>
    );
}
